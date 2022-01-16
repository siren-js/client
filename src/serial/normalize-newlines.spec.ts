import normalizeNewlines from './normalize-newlines';

const normalized = 'lorem\r\nipsum\r\ndolor\r\nsit\r\namet\r\n';

test('should replace all CR not followed by LF with CRLF', () => {
  const s = 'lorem\ripsum\rdolor\rsit\ramet\r';

  const result = normalizeNewlines(s);

  expect(result).toBe(normalized);
});

test('should replace all LR not preceded by CR with CRLF', () => {
  const s = 'lorem\nipsum\ndolor\nsit\namet\n';

  const result = normalizeNewlines(s);

  expect(result).toBe(normalized);
});

test('should not replace CRLF', () => {
  const result = normalizeNewlines(normalized);

  expect(result).toBe(normalized);
});
