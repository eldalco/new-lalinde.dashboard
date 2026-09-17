"use client";

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";

/**
 * Horizontal drag-to-scroll for overflow containers.
 * Ignores drags that start on interactive controls (buttons, inputs, selects).
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const state = useRef({
    isPointerDown: false,
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });

  const onPointerDown = useCallback((event: ReactPointerEvent<T>) => {
    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, select, textarea, label, [role='switch']")) {
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    state.current = {
      isPointerDown: true,
      isDragging: false,
      startX: event.clientX,
      scrollLeft: element.scrollLeft,
    };
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<T>) => {
    const element = ref.current;
    const current = state.current;

    if (!element || !current.isPointerDown) {
      return;
    }

    const deltaX = event.clientX - current.startX;

    if (!current.isDragging && Math.abs(deltaX) < 6) {
      return;
    }

    if (!current.isDragging) {
      current.isDragging = true;
      element.setPointerCapture(event.pointerId);
      element.style.cursor = "grabbing";
      element.style.userSelect = "none";
    }

    event.preventDefault();
    element.scrollLeft = current.scrollLeft - deltaX;
  }, []);

  const endDrag = useCallback((event: ReactPointerEvent<T>) => {
    const element = ref.current;
    const current = state.current;

    if (!current.isPointerDown) {
      return;
    }

    if (element && current.isDragging) {
      try {
        element.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer may already be released.
      }
      element.style.cursor = "grab";
      element.style.userSelect = "";
    }

    state.current.isPointerDown = false;
    state.current.isDragging = false;
  }, []);

  return {
    ref,
    dragProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onPointerCancel: endDrag,
      className: "cursor-grab",
    },
  };
}
