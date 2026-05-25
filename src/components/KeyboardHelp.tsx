import { useEffect, useState } from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(8, 10, 14, 0.7);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 20px;
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  width: min(520px, 100%);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  h2 { margin: 0; font-size: 20px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.textMuted}; font-size: 13px; }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  font-size: 14px;
`;

const Kbd = styled.kbd`
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 3px 8px;
  color: ${({ theme }) => theme.colors.text};
  margin-left: 6px;
  &:first-child { margin-left: 0; }
`;

const Close = styled.button`
  align-self: flex-end;
  background: ${({ theme }) => theme.colors.accent};
  color: #0b0e14;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
`;

const HelpButton = styled.button`
  position: fixed;
  bottom: 18px;
  right: 18px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  border: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  z-index: 5;
  box-shadow: ${({ theme }) => theme.shadows.raised};
  transition: box-shadow 200ms ease;
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.raisedLarge};
  }
`;

const SHORTCUTS: Array<{ keys: string[]; label: string }> = [
  { keys: ["/"], label: "Focus search" },
  { keys: ["j", "k", "↓", "↑"], label: "Move card focus (next row)" },
  { keys: ["h", "l", "←", "→"], label: "Move card focus (sideways)" },
  { keys: ["x", "Space"], label: "Toggle selection on focused card" },
  { keys: ["a"], label: "Select all visible" },
  { keys: ["Esc"], label: "Clear search, then clear selection" },
  { keys: ["?"], label: "Show / hide this help" },
];

export function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLElement &&
        (e.target.tagName === "INPUT" ||
          e.target.tagName === "TEXTAREA" ||
          e.target.isContentEditable);
      if (e.key === "?" && !isInput) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <HelpButton
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        ?
      </HelpButton>
      {open && (
        <Backdrop
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
          onClick={() => setOpen(false)}
        >
          <Dialog onClick={(e) => e.stopPropagation()}>
            <h2>Keyboard shortcuts</h2>
            <p>Anywhere on the gallery, no modifier keys required.</p>
            {SHORTCUTS.map((s) => (
              <Row key={s.label}>
                <span>{s.label}</span>
                <span>
                  {s.keys.map((k, i) => (
                    <Kbd key={i}>{k}</Kbd>
                  ))}
                </span>
              </Row>
            ))}
            <Close type="button" onClick={() => setOpen(false)}>
              Close
            </Close>
          </Dialog>
        </Backdrop>
      )}
    </>
  );
}
