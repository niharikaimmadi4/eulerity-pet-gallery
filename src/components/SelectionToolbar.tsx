import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelection } from "../context/SelectionContext";
import { usePetsContext } from "../context/PetsContext";
import { useImageSizes } from "../hooks/useImageSizes";
import { downloadAsZip, downloadMany, type ZipProgress } from "../utils/download";
import { formatBytes } from "../utils/format";

const Bar = styled.div<{ $visible: boolean }>`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  transform: translateY(${({ $visible }) => ($visible ? "0" : "calc(100% + 32px)")});
  transition: transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadows.raisedLarge};
  z-index: 20;
  max-width: 1280px;
  margin: 0 auto;
`;

const Inner = styled.div`
  padding: 16px 22px;
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
    $variant === "primary" ? theme.colors.accent : theme.colors.surface};
  color: ${({ theme, $variant }) =>
    $variant === "primary" ? "white" : theme.colors.text};
  border: 0;
  border-radius: ${({ theme }) => theme.radiusPill};
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ theme, $variant }) =>
    $variant === "primary"
      ? "0 6px 16px rgba(255, 122, 107, 0.35)"
      : theme.shadows.raisedSmall};
  transition: box-shadow 200ms ease, transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme, $variant }) =>
      $variant === "primary"
        ? "0 10px 20px rgba(255, 122, 107, 0.4)"
        : theme.shadows.raised};
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
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
