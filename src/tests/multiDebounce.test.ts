import { multiDebounce } from "../mutliDebounce";
import { act } from "@testing-library/react";

describe("multiDebounce", () => {
  const fn = vi.fn();
  const delays = {
    a: 100,
    b: 200,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    fn.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return debounced functions", () => {
    const debouncedFns = multiDebounce(fn, delays);

    expect(debouncedFns).toHaveProperty("a");
    expect(debouncedFns).toHaveProperty("b");
    expect(debouncedFns.a).toHaveProperty("cancel");
    expect(debouncedFns.a).toHaveProperty("flush");
  });

  it("should call debounced function", () => {
    const debouncedFns = multiDebounce(fn, delays);

    debouncedFns.a();

    expect(fn).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should cancel other debounces", () => {
    const debouncedFns = multiDebounce(fn, delays);

    debouncedFns.a();
    debouncedFns.b();

    expect(fn).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should preserve fn context", () => {
    const debouncedFns = multiDebounce(fn, delays);
    const context = { some: "value" };

    debouncedFns.a.call(context);

    vi.runAllTimers();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.contexts[0]).toBe(context);
  });
});
