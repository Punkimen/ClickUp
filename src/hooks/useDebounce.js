import { useCallback, useRef } from "react";

export default function useDebounce(cb, delay) {
  const timer = useRef();

  const debounceCb = useCallback((...args) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      cb(...args)
    }, delay);
  }, [cb, delay])
  return debounceCb
}