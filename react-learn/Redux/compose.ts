
// export default function compose<R>(...funcs: Function[]): (...args: any[]) => R

export default function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    return <T>(arg: T) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  // compose(f, g, h) == (...args) => f(g(h(...args)));
  return funcs.reduce((a, b) => (...args: any) => a(b(...args)));
}

