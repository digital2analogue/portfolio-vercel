/**
 * First sentence of a token description, for the /tokens reference page.
 *
 * Upstream Parsimony descriptions are deliberately thorough (multi-sentence
 * usage guidance for agents); the viewer page only needs the role line. The
 * split requires a capital/quote/digit after the period so abbreviations like
 * "e.g. foo" don't end a sentence early. Pure + shared by server and client.
 */
export function firstSentence(text: string): string {
  if (!text) return text;
  const [first] = text.split(/(?<=\.)\s+(?=[A-Z0-9"'(])/);
  return first;
}
