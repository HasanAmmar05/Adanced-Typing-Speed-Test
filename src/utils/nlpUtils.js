export function analyzeText(text) {
  const words = text.trim().split(/\s+/)
  const uniqueWords = new Set(words)

  return {
    wordCount: words.length,
    uniqueWordCount: uniqueWords.size,
    averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length,
    lexicalDensity: uniqueWords.size / words.length
  }
}

export function calculateDifficulty(text) {
  const { wordCount, uniqueWordCount, averageWordLength, lexicalDensity } = analyzeText(text)
  
  let score = 0
  score += wordCount > 120 ? 3 : wordCount > 80 ? 2 : wordCount > 50 ? 1 : 0
  score += uniqueWordCount / wordCount > 0.7 ? 3 : uniqueWordCount / wordCount > 0.5 ? 2 : uniqueWordCount / wordCount > 0.3 ? 1 : 0
  score += averageWordLength > 6 ? 3 : averageWordLength > 5 ? 2 : averageWordLength > 4 ? 1 : 0
  score += lexicalDensity > 0.7 ? 3 : lexicalDensity > 0.5 ? 2 : lexicalDensity > 0.3 ? 1 : 0

  if (score >= 9) return 'hard'
  if (score >= 5) return 'medium'
  return 'easy'
}