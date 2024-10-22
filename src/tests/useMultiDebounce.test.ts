import { vi } from "vitest";
import { useMultiDebounce } from "../useMultiDebounce";
import type { DelaysConfig } from "../types";
import { renderHook, act } from "@testing-library/react";

describe("useMultiDebounce", () => {
  const fn1 = vi.fn();
  const fn2 = vi.fn();

  const delays = {
    a: 100,
    b: 200,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    fn1.mockClear();
    fn2.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return debounced function", () => {
    const { result } = renderHook(() => useMultiDebounce(fn1, delays));
    const debouncedFns = result.current;

    expect(debouncedFns).toHaveProperty("a");
    expect(debouncedFns).toHaveProperty("b");
    expect(debouncedFns.a).toHaveProperty("cancel");
    expect(debouncedFns.a).toHaveProperty("flush");
  });

  it("should call debounced function", () => {
    const { result } = renderHook(() => useMultiDebounce(fn1, delays));
    const debouncedFns = result.current;

    act(() => {
      debouncedFns.a();
    });

    expect(fn1).not.toHaveBeenCalled();

    act(() => {
      vi.runAllTimers();
    });

    expect(fn1).toHaveBeenCalledTimes(1);
  });

  it("should cancel other debounces", () => {
    const { result } = renderHook(() => useMultiDebounce(fn1, delays));
    const debouncedFns = result.current;

    act(() => {
      debouncedFns.a();
      debouncedFns.b();
    });

    expect(fn1).not.toHaveBeenCalled();

    act(() => {
      vi.runAllTimers();
    });

    expect(fn1).toHaveBeenCalledTimes(1);
  });

  it("should change the called function if it was updated", () => {
    let fn = fn1;

    const { result, rerender } = renderHook(() => useMultiDebounce(fn, delays));
    const debouncedFns = result.current;

    act(() => {
      debouncedFns.a();
    });

    fn = fn2;
    rerender();

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();

    act(() => {
      vi.runAllTimers();
    });

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  it("should cancel all calls if delays was updated", () => {
    let delays: DelaysConfig = {
      a: 200,
      b: 300,
    };

    const { result, rerender } = renderHook(() =>
      useMultiDebounce(fn1, delays),
    );

    act(() => {
      result.current.a();
    });

    delays = {
      c: 400,
    };

    rerender();

    act(() => {
      result.current.c();
    });

    expect(fn1).not.toHaveBeenCalled();

    act(() => {
      vi.runAllTimers();
    });

    expect(fn1).toHaveBeenCalledTimes(1);
  });

  it("should cancel all calls if hook was unmounted", () => {
    const { result, unmount } = renderHook(() => useMultiDebounce(fn1, delays));

    act(() => {
      result.current.a();
    });

    expect(fn1).not.toHaveBeenCalled();

    unmount();

    act(() => {
      vi.runAllTimers();
    });

    expect(fn1).not.toHaveBeenCalled();
  });
});
