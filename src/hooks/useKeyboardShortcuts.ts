import { useEffect } from "react";

export interface ShortcutHandlers {
  enabled: boolean;
  onFocusSearch: () => void;
  onClearAll: () => void;
  onSelectAllVisible: () => void;
  onMoveFocus: (delta: number) => void;
  onToggleFocused: () => void;
  columnCount: () => number;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    if (!handlers.enabled) return;

    const onKey = (e: KeyboardEvent) => {
      // Esc should always work, even from inside inputs.
      if (e.key === "Escape") {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        handlers.onClearAll();
        return;
      }
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case "/":
          e.preventDefault();
          handlers.onFocusSearch();
          break;
        case "j":
        case "ArrowDown":
          e.preventDefault();
          handlers.onMoveFocus(handlers.columnCount());
          break;
        case "k":
        case "ArrowUp":
          e.preventDefault();
          handlers.onMoveFocus(-handlers.columnCount());
          break;
        case "h":
        case "ArrowLeft":
          e.preventDefault();
          handlers.onMoveFocus(-1);
          break;
        case "l":
        case "ArrowRight":
          e.preventDefault();
          handlers.onMoveFocus(1);
          break;
        case "x":
        case " ":
          e.preventDefault();
          handlers.onToggleFocused();
          break;
        case "a":
          e.preventDefault();
          handlers.onSelectAllVisible();
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
}
