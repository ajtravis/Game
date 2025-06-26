export const to12x12Grid = (tilesFlat) => {
  if (!tilesFlat || tilesFlat.length !== 144) return [];        // safety
  const grid = [];
  for (let row = 0; row < 12; row++) {
    const start = row * 12;              // index of first tile in this row
    const end = start + 12;              // slice up to (not incl.) end
    grid.push(tilesFlat.slice(start, end));
  }
  return grid;
};