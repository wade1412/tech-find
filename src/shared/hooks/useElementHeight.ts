import { useLayoutEffect, useRef, useState } from "react";

export function useElementHeight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const updateHeight = (nextHeight: number) => {
      const rounded = Math.round(nextHeight);
      setHeight((current) => (current === rounded ? current : rounded));
    };

    updateHeight(node.getBoundingClientRect().height);

    const observer = new ResizeObserver(([entry]) => {
      const borderBoxSize = entry.borderBoxSize as
        | ResizeObserverSize
        | readonly ResizeObserverSize[]
        | undefined;
      const firstBox = Array.isArray(borderBoxSize)
        ? borderBoxSize[0]
        : (borderBoxSize as ResizeObserverSize | undefined);
      const blockSize = firstBox?.blockSize;

      updateHeight(blockSize ?? entry.contentRect.height);
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return { ref, height };
}
