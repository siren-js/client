const normalizeNewlines = (s: string): string => s.replace(/(?<!\r)\n|\r(?!\n)/g, '\r\n');

export default normalizeNewlines;
