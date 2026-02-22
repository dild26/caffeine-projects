import { useEffect, useRef, useCallback } from 'react';

export function useDebouncedSave<T>(
  value: T,
  onSave: (value: T) => void,
  delay: number = 3000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialValueRef = useRef<T>(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      initialValueRef.current = value;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSave(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, onSave, delay]);

  const saveImmediately = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onSave(value);
  }, [value, onSave]);

  return { saveImmediately };
}
