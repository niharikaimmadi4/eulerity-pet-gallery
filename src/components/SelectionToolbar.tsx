import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelection } from "../context/SelectionContext";
import { usePetsContext } from "../context/PetsContext";
import { useImageSizes } from "../hooks/useImageSizes";
import { downloadAsZip, downloadMany, type ZipProgress } from "../utils/download";
import { formatBytes } from "../utils/format";

const Bar = styled.div<{ $visible: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(${({ $visible }) => ($visible ? "0" : "120%")});
  transition: transform 220ms ease;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 20;
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  strong { color: ${({ theme }) => theme.colors.text}; font-size: 15px; }
`;

const Spacer = styled.div`
  flex: 1;
`;

const Btn = styled.button<{ $variant?: "primary" | "ghost" }>`
  background: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.accent : "transparent"};
  color: ${({ theme, $variant }) =>
    $variant === "primary" ? "#0b0e14" : theme.colors.text};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "primary" ? theme.colors.accent : theme.colors.border};
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  &:hover { filter: brightness(1.08); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Progress = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function SelectionToolbar() {
  const { selected, count, clear } = useSelection();
  const { pets } = usePetsContext();
  const [busy, setBusy] = useState<null | "individual" | "zip">(null);
  const [progress, setProgress] = useState<ZipProgress | null>(null);

  const selectedPets = pets.filter((p) => selected.has(p.id));
  const urls = selectedPets.map((p) => p.url);
  const sizes = useImageSizes(urls);

  const known = urls.map((u) => sizes[u]).filter((v): v is number => typeof v === "number");
  const totalKnown = known.reduce((a, b) => a + b, 0);
  const unknownCount = urls.length - known.length;

  // Reset busy/progress when selection clears mid-flight.
  useEffect(() => {
    if (count === 0) {
      setBusy(null);
      setProgress(null);
    }
  }, [count]);

  const onDownload = async () => {
    setBusy("individual");
    try {
      await downloadMany(selectedPets);
    } finally {
      setBusy(null);
    }
  };

  const onZip = async () => {
    setBusy("zip");
    setProgress({ completed: 0, total: selectedPets.length, failed: 0 });
    try {
      const final = await downloadAsZip(selectedPets, setProgress);
      setProgress(final);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Bar $visible={count > 0} aria-hidden={count === 0} role="region" aria-label="Selection actions">
      <Inner>
        <Info aria-live="polite">
          <strong>
            {count} pet{count === 1 ? "" : "s"} selected
          </strong>
          <span>
            ~{formatBytes(totalKnown)}
            {unknownCount > 0 && ` (+${unknownCount} unknown)`}
          </span>
          {progress && busy === "zip" && (
            <Progress>
              Zipping {progress.completed + progress.failed}/{progress.total}
              {progress.failed > 0 && `, ${progress.failed} skipped`}
            </Progress>
          )}
        </Info>
        <Spacer />
        <Btn onClick={clear} disabled={busy !== null}>
          Clear selection
        </Btn>
        <Btn onClick={onDownload} disabled={busy !== null}>
          {busy === "individual" ? "Downloading" : "Download individually"}
        </Btn>
        <Btn $variant="primary" onClick={onZip} disabled={busy !== null}>
          {busy === "zip" ? "Zipping" : `Download ${count} as ZIP`}
        </Btn>
      </Inner>
    </Bar>
  );
}
