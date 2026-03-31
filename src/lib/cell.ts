const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const toCellKey = (row: number, col: number) => `${letters[col]}${row + 1}`;
