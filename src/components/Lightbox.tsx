import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import type { Pet } from "../types/pet";
import { downloadPet } from "../utils/download";

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 6, 10, 0.92);
  backdrop-filter: blur(6px);
  z-index: 60;
  display: grid;
  grid-template-rows: auto 1fr auto;
  animation: ${fadeIn} 160ms ease;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  /* The lightbox stays dark-themed regardless of the app theme, so the
     image is always the focus. Text colors are hardcoded to light. */
  color: #ffffff;
  background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
`;

const TopInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  strong { font-size: 16px; color: #ffffff; }
  span { font-size: 12px; color: rgba(255, 255, 255, 0.65); }
`;

const TopActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const IconBtn = styled.button`
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #ffffff;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: grid;
  place-items: center;
  transition: background 160ms ease;
  &:hover { background: rgba(255, 255, 255, 0.22); }
`;

const Stage = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  padding: 0 60px;
  overflow: hidden;
  min-height: 0;

  .imageHolder {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 12px;
  }
`;

const NavArrow = styled.button<{ $side: "left" | "right" }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $side }) => ($side === "left" ? "left: 14px;" : "right: 14px;")}
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #ffffff;
  font-size: 22px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 120ms ease, transform 120ms ease;
  &:hover {
    background: rgba(255, 255, 255, 0.22);
    transform: translateY(-50%) scale(1.05);
  }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

const Caption = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);

  p { margin: 0; max-width: 760px; line-height: 1.5; color: #ffffff; }
  span { white-space: nowrap; }
`;

interface Props {
  pets: Pet[];
  index: number;
  onClose: () => void;
  onChange: (nextIndex: number) => void;
}

export function Lightbox({ pets, index, onClose, onChange }: Props) {
  const pet = pets[index];
  const hasPrev = index > 0;
  const hasNext = index < pets.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        e.preventDefault();
        onChange(index - 1);
      } else if (e.key === "ArrowRight" && hasNext) {
        e.preventDefault();
        onChange(index + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, hasPrev, hasNext, onChange, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  if (!pet) return null;

  return (
    <Backdrop
      role="dialog"
      aria-modal="true"
      aria-label={`${pet.title}, image ${index + 1} of ${pets.length}`}
      onClick={onClose}
    >
      <TopBar onClick={(e) => e.stopPropagation()}>
        <TopInfo>
          <strong>{pet.title}</strong>
          <span>
            {index + 1} of {pets.length}
          </span>
        </TopInfo>
        <TopActions>
          <IconBtn
            type="button"
            onClick={() => downloadPet(pet)}
            aria-label="Download this image"
            title="Download"
          >
            ↓
          </IconBtn>
          <IconBtn type="button" onClick={onClose} aria-label="Close lightbox" title="Close (Esc)">
            ×
          </IconBtn>
        </TopActions>
      </TopBar>

      <Stage onClick={(e) => e.stopPropagation()}>
        <NavArrow
          type="button"
          $side="left"
          onClick={() => hasPrev && onChange(index - 1)}
          disabled={!hasPrev}
          aria-label="Previous image"
          title="Previous ()"
        >

        </NavArrow>
        <div className="imageHolder">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={pet.url}
              src={pet.url}
              alt={pet.title}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.005 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            />
          </AnimatePresence>
        </div>
        <NavArrow
          type="button"
          $side="right"
          onClick={() => hasNext && onChange(index + 1)}
          disabled={!hasNext}
          aria-label="Next image"
          title="Next ()"
        >

        </NavArrow>
      </Stage>

      <Caption onClick={(e) => e.stopPropagation()}>
        <p>{pet.description}</p>
        <span>Arrow keys to navigate · Esc to close</span>
      </Caption>
    </Backdrop>
  );
}
