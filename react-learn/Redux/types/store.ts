import { Action, AnyAction } from './actions';
import { Reducer } from './reducers';
import '../utils/symbol-observable';



export interface Dispatch<A extends Action = AnyAction> {
    <T extends A>(action: T, ...extraArgs: any[]): T
}
