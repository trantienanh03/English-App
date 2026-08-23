export interface SourceBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function getContainedBoxLayout(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
  box: SourceBox,
) {
  if (containerWidth <= 0 || containerHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) return null;
  const scale = Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
  const offsetX = (containerWidth - imageWidth * scale) / 2;
  const offsetY = (containerHeight - imageHeight * scale) / 2;
  const x1 = Math.min(imageWidth, Math.max(0, box.x1));
  const y1 = Math.min(imageHeight, Math.max(0, box.y1));
  const x2 = Math.min(imageWidth, Math.max(x1, box.x2));
  const y2 = Math.min(imageHeight, Math.max(y1, box.y2));
  return {
    left: offsetX + x1 * scale,
    top: offsetY + y1 * scale,
    width: Math.max(1, (x2 - x1) * scale),
    height: Math.max(1, (y2 - y1) * scale),
  };
}

export function sortBoxesForHitTesting<T extends { id: string; confidence: number; box: SourceBox }>(boxes: T[]): T[] {
  return [...boxes].sort((a, b) => {
    const areaA = (a.box.x2 - a.box.x1) * (a.box.y2 - a.box.y1);
    const areaB = (b.box.x2 - b.box.x1) * (b.box.y2 - b.box.y1);
    if (areaA !== areaB) return areaB - areaA;
    if (a.confidence !== b.confidence) return a.confidence - b.confidence;
    return a.id.localeCompare(b.id);
  });
}
