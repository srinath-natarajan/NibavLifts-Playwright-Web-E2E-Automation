export type SideKey = 'A' | 'B' | 'C' | 'D' | 'A+C' | 'B+D';

export const sideLabelMap: Record<SideKey, string[]> = {
  A: ['Side A', 'Côté A'],
  B: ['Side B', 'Côté B'],
  C: ['Side C', 'Côté C'],
  D: ['Side D', 'Côté D'],
  'A+C': ['Side A+C', 'Côté A+C'],
  'B+D': ['Side B+D', 'Côté B+D'],
};

const sideBreakdownMap: Record<SideKey, string[]> = {
  A: ['A'],
  B: ['B'],
  C: ['C'],
  D: ['D'],
  'A+C': ['A', 'C'],
  'B+D': ['B', 'D'],
};

const selectedUniqueSides = new Set<string>();

export function getValidRandomSide(floor: number): SideKey {
  const allSides: SideKey[] = floor === 0
    ? ['A', 'A+C']
    : ['A', 'B', 'C', 'D', 'A+C', 'B+D'];

  const shuffled = allSides.sort(() => 0.5 - Math.random());

  for (const side of shuffled) {
    const breakdown = sideBreakdownMap[side]; // e.g., A+C → [A, C]
    const simulatedSet = new Set(selectedUniqueSides);
    breakdown.forEach(letter => simulatedSet.add(letter));

    if (simulatedSet.size < 4) {
      breakdown.forEach(letter => selectedUniqueSides.add(letter));
      return side;
    }
  }

  return floor === 0 ? 'A' : 'A';
}

export function resetSelectedSides(): void {
  selectedUniqueSides.clear();
}