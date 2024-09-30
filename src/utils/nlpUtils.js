export function analyzeText(text) {
  if (!text) return null;
  const words = text.trim().split(/\s+/)
  const uniqueWords = new Set(words)
  const sentenceCount = (text.match(/[.!?]+/g) || []).length || 1
  const syllableCount = words.reduce((count, word) => count + countSyllables(word), 0)

  return {
    wordCount: words.length,
    uniqueWordCount: uniqueWords.size,
    averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length,
    lexicalDensity: uniqueWords.size / words.length,
    sentenceCount,
    syllableCount,
  }
}

function countSyllables(word) {
  if (!word) return 0;
  word = word.toLowerCase();
  if(word.length <= 3) { return 1; }
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const syllableMatches = word.match(/[aeiouy]{1,2}/g);
  return syllableMatches ? syllableMatches.length : 1;
}

export function calculateDifficulty(text) {
  if (!text) return 'easy';
  const analysis = analyzeText(text);
  if (!analysis) return 'easy';
  
  const { wordCount, uniqueWordCount, averageWordLength, lexicalDensity, sentenceCount, syllableCount } = analysis;
  
  // Calculate Flesch-Kincaid Grade Level
  const fkgl = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
  
  // Calculate Gunning Fog Index
  const complexWords = text.split(/\s+/).filter(word => countSyllables(word) > 2).length;
  const gfi = 0.4 * ((wordCount / sentenceCount) + 100 * (complexWords / wordCount));

  // Normalize scores
  const normalizedFKGL = Math.min(Math.max(fkgl, 0), 18) / 18;
  const normalizedGFI = Math.min(Math.max(gfi, 0), 20) / 20;
  const normalizedLexicalDensity = Math.min(lexicalDensity, 1);

  // Calculate final score
  const score = (normalizedFKGL + normalizedGFI + normalizedLexicalDensity) / 3;

  if (score > 0.7) return 'hard';
  if (score > 0.4) return 'medium';
  return 'easy';
}