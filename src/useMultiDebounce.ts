import type { AnyFunction, DefaultDelaysConfig, DelaysConfig, MutliDebounceFunctions } from "./types";
import { useEffect, useMemo, useRef } from "react";
import { multiDebounce } from "./mutliDebounce";

export const useMultiDebounce = <
  T extends AnyFunction,
  D extends DelaysConfig = DefaultDelaysConfig,
>(
  fn: T,
  delays?: D
) => {
  const latestCallbackRef = useRef(fn);
  const latestFnRefs = useRef<MutliDebounceFunctions<T, D> | null>(null);

  useEffect(() => {
    latestCallbackRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () =>
      Object.values(latestFnRefs.current || {}).forEach((fn) => fn.cancel?.());
  }, []);

  return useMemo(() => {
    const newResultFns = multiDebounce(
      function (this: unknown, ...args) {
        return latestCallbackRef.current?.apply(this, args);
      } as T,
      delays
    );

    Object.values(
      latestFnRefs.current || ({} as MutliDebounceFunctions<T, D>)
    ).forEach((fn) => fn.cancel?.());
    latestFnRefs.current = newResultFns;

    return newResultFns;
  }, [delays]);
};
