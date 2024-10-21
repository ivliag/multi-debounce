import type { DebouncedFunc } from "lodash";
import { defaultMultiDebounceDelays } from "./mutliDebounce";

export type AnyFunction = (...args: unknown[]) => unknown;

export type DelaysConfig = Record<string | number, number>;

export type DefaultDelaysConfig = Record<
  keyof typeof defaultMultiDebounceDelays,
  number
>;

export type MutliDebounceFunctions<
  T extends AnyFunction,
  D extends DelaysConfig,
> = Record<keyof D, DebouncedFunc<T>>;
