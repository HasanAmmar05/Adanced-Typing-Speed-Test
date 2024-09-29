const easyWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at']
const mediumWords = ['about', 'which', 'their', 'some', 'time', 'will', 'from', 'people', 'year', 'know', 'other', 'than', 'now', 'only', 'like', 'more', 'over', 'such', 'most', 'also']
const hardWords = ['although', 'necessary', 'experience', 'environment', 'development', 'government', 'opportunity', 'understanding', 'relationship', 'organization', 'particularly', 'responsibility', 'international', 'significantly', 'administration', 'unfortunately', 'approximately', 'communication', 'environmental', 'circumstances']

export function generateParagraph(difficulty) {
  let words
  let length

  switch (difficulty) {
    case 'easy':
      words = easyWords
      length = 20
      break
    case 'medium':
      words = [...easyWords, ...mediumWords]
      length = 30
      break
    case 'hard':
      words = [...easyWords, ...mediumWords, ...hardWords]
      length = 40
      break
    default:
      words = [...easyWords, ...mediumWords]
      length = 30
  }

  const paragraph = []
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * words.length)
    paragraph.push(words[randomIndex])
  }

  return paragraph.join(' ')
}