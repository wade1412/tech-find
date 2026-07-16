import { useLayoutEffect, useRef, useState } from "react";

interface UseAvailableViewportHeightOptions {
  reservedBottomSelector?: string;
  containerSelector?: string;
}

export function useAvailableViewportHeight<T extends HTMLElement>({
  reservedBottomSelector,
  containerSelector,
}: UseAvailableViewportHeightOptions = {}) {
  const ref = useRef<T | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reservedBottomElement = reservedBottomSelector
      ? document.querySelector<HTMLElement>(reservedBottomSelector)
      : null;

    const updateHeight = () => {
      const container = containerSelector
        ? node.closest<HTMLElement>(containerSelector)
        : null;
      const containerBottomPadding = container
        ? Number.parseFloat(getComputedStyle(container).paddingBottom) || 0
        : 0;
      const reservedBottomHeight =
        reservedBottomElement?.getBoundingClientRect().height ?? 0;
      const availableHeight = Math.max(
        0,
        window.innerHeight -
          node.getBoundingClientRect().top -
          reservedBottomHeight -
          containerBottomPadding,
      );
      const roundedHeight = Math.floor(availableHeight);

      setHeight((currentHeight) =>
        currentHeight === roundedHeight ? currentHeight : roundedHeight,
      );
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    if (reservedBottomElement) observer.observe(reservedBottomElement);

    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [containerSelector, reservedBottomSelector]);

  return { ref, height };
}
