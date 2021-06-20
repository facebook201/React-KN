import $$observable from './utils/symbol-observable';

import {
    Store,
    PreloadedState,
    Dispatch,
    Observer,
    StoreEnhancer,
    ExtendState,
} from './types/store';
import { Action } from './types/actions';
import { Reducer } from './types/reducers';
import ActionTypes from './utils/actionTypes';
import isPlainObject from './utils/isPlainObject';

/**
 * 创建一个 Redux Store 来存储 状态树，改变状态唯一的方法是 dispatch。
 * combineReducers 函数可以用来组合多个 reducers 成为单个 reducer。
 * 
 * @param reducer  reducer 是一个返回下一个状态的函数，提供当前 state 树和 action 处理动作
 * 
 * @param preloadedState 初始 state，如果使用 combineReducers 来生成根树，来生成根 reducer 函数，
 * 它必须是一个与 `combineReducers` 键具有相同形状的对象。
 * 
 */
export default function createStore<
    S,
    A extends Action,
    Ext = {},
    StateExt = never,
>(
    reducer: Reducer<S, A>,
    preloadedState?: any,
    enhancer?: StoreEnhancer<Ext, StateExt>
): Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext {
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState as StoreEnhancer<Ext, StateExt>
        preloadedState = undefined
    }

    if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
          throw new Error(
            `Expected the enhancer to be a function. Instead, received: '${kindOf(
              enhancer
            )}'`
          )
        }
    
        return enhancer(createStore)(
          reducer,
          preloadedState as PreloadedState<S>
        ) as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
    }

    // 功能嗅探
    let currentReducer = reducer;
    let currentState = preloadedState as S;
    let currentListeners: (() => void)[] | null = [];
    let nextListeners = currentListeners;
    let isDispatching = false;


    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice()
        }
    }
    /**
     * getState 获取 状态树
     */

    function getState(): S {
        if (isDispatching) {
            throw new Error('在执行的过程中不能获取 state');
        }
        return currentState as S;
    }

    /**
     * 添加一个 change listener, 任何时候一个动作被派发时都会被调用。
     */

    function subscribe(listener: () => void) {
        let isSubscribed = true;

        ensureCanMutateNextListeners();
        nextListeners.push(listener);

        return function unsubscribe() {
            if (!isSubscribed) { return }
            if (isDispatching) {

            }

            isSubscribed = false;

            ensureCanMutateNextListeners();
            const index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
            currentListeners = null;
        }
    }


    function dispatch(action: A) {
        try {
            isDispatching = true;
            currentState = currentReducer(currentState, action);
        } finally {
            isDispatching = false;
        }

        const listeners = (currentListeners = nextListeners);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }

        return action;
    }

    function observable() {
        const outerSubscribe = subscribe;

        return {
            subscribe(observer: unknown) {
                function observeState() {
                    const observerAsObserver = observer as Observer<S>;
                    if (observerAsObserver.next) {
                        observerAsObserver.next(getState());
                    }
                }

                observeState();
                const unsubscribe = outerSubscribe(observeState);
                return { unsubscribe };
            },
            [$$observable]() {
                return this;
            }
        }
    }

    dispatch({ type: ActionTypes.INIT } as A);
    
    const store = {
        dispatch: dispatch as Dispatch<A>,
        subscribe,
        getState,
        [$$observable]: observable
    } as unknown as Store;

    return store;
}

