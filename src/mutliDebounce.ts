import type { DebouncedFunc } from "lodash";
import { debounce } from "lodash";
import {
  AnyFunction,
  DefaultDelaysConfig,
  DelaysConfig,
  MutliDebounceFunctions,
} from "./types";

export const defaultMultiDebounceDelays = {
  none: 0,
  xs: 10,
  s: 50,
  m: 200,
  l: 1000,
  xl: 3000,
  0: 0,
  50: 50,
  100: 100,
  200: 200,
  500: 500,
  1000: 1000,
  2000: 2000,
  3000: 3000,
} as const;

export const multiDebounce = <
  T extends AnyFunction,
  D extends DelaysConfig = DefaultDelaysConfig,
>(
  fn: T,
  delays?: D,
) => {
  const resolvedDelays = delays || defaultMultiDebounceDelays;
  const resultFns = {} as MutliDebounceFunctions<T, D>;

  const cancelAll = () => {
    Object.entries(resultFns).forEach(([, fn]) => {
      fn.cancel();
    });
  };

  const flushAll = () => {
    Object.entries(resultFns).forEach(([, fn]) => {
      fn.flush();
    });
  };

  Object.entries(resolvedDelays).forEach(([thisFnDelayKey, delay]) => {
    const cancelOtherDebouces = () => {
      Object.entries(resultFns).forEach(([allFnsDelayKey, fn]) => {
        if (allFnsDelayKey !== thisFnDelayKey) {
          fn.cancel();
        }
      });
    };

    const debounced = debounce(fn, delay);

    const connectedFn = function (this: unknown, ...args: Parameters<T>) {
      cancelOtherDebouces();
      return debounced.apply(this, args);
    };

    // eslint-disable-next-line @typescript-eslint/unbound-method
    connectedFn.cancel = debounced.cancel;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    connectedFn.flush = debounced.flush;

    resultFns[thisFnDelayKey as keyof D] = connectedFn;
  });

  return { ...resultFns, cancelAll, flushAll };
};
