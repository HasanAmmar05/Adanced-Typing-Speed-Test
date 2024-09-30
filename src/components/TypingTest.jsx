import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Timer from './Timer'
import Results from './Results'
import DifficultySelector from './DifficultySelector'
import { generateParagraph } from '../utils/textGenerator'
import { analyzeText, calculateDifficulty } from '../utils/nlpUtils'

function TypingTest() {
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const [isFinished, setIsFinished] = useState(false)
  const [textAnalysis, setTextAnalysis] = useState(null)
  const inputRef = useRef(null)

  const calculateTime = (wordCount) => {
    const baseTime = 30 // Base time for 50 words
    const baseWords = 50
    return Math.max(30, Math.round((wordCount / baseWords) * baseTime))
  }

  useEffect(() => {
    const newText = generateParagraph(difficulty)
    setText(newText)
    const analysis = analyzeText(newText)
    setTextAnalysis(analysis)
    setTimeLeft(calculateTime(analysis.wordCount))
  }, [difficulty])

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      clearInterval(interval)
      setIsFinished(true)
      saveHighScore()
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const handleStart = () => {
    setTimeLeft(calculateTime(textAnalysis.wordCount))
    setUserInput('')
    setIsActive(true)
    setIsFinished(false)
    inputRef.current.focus()
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserInput(value)

    if (value === text) {
      setIsActive(false)
      setIsFinished(true)
      saveHighScore()
    }
  }

  const calculateWPM = () => {
    const words = userInput.trim().split(/\s+/).length
    const minutes = (calculateTime(textAnalysis.wordCount) - timeLeft) / 60
    return Math.round(words / minutes) || 0
  }

  const calculateAccuracy = () => {
    const correctChars = userInput.split('').filter((char, index) => char === text[index]).length
    return Math.round((correctChars / userInput.length) * 100) || 0
  }

  const saveHighScore = () => {
    const wpm = calculateWPM()
    const accuracy = calculateAccuracy()
    const highScores = JSON.parse(localStorage.getItem('highScores')) || []
    const newScore = { wpm, accuracy, date: new Date().toISOString() }
    highScores.push(newScore)
    highScores.sort((a, b) => b.wpm - a.wpm)
    localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 5)))
  }

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
        <Timer timeLeft={timeLeft} />
      </div>
      {textAnalysis && (
        <motion.div 
          className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-2">Text Analysis</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>Word Count: {textAnalysis.wordCount}</p>
            <p>Unique Words: {textAnalysis.uniqueWordCount}</p>
            <p>Avg. Word Length: {textAnalysis.averageWordLength.toFixed(2)}</p>
            <p>Lexical Density: {textAnalysis.lexicalDensity.toFixed(2)}</p>
          </div>
          <p className="mt-2">Calculated Difficulty: <span className="font-semibold capitalize">{calculateDifficulty(text)}</span></p>
        </motion.div>
      )}
      <motion.div 
        className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p className="text-lg mb-4 whitespace-pre-wrap leading-relaxed">
          {text.split('').map((char, index) => {
            let color = ''
            if (index < userInput.length) {
              color = char === userInput[index] ? 'text-green-500' : 'text-red-500'
            }
            return <span key={index} className={color}>{char}</span>
          })}
        </p>
        <textarea
          ref={inputRef}
          className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          disabled={!isActive || isFinished}
        />
      </motion.div>
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleStart}
          disabled={isActive && !isFinished}
        >
          {isActive && !isFinished ? 'Typing...' : 'Start Test'}
        </button>
      </motion.div>
      {isFinished && (
        <Results wpm={calculateWPM()} accuracy={calculateAccuracy()} />
      )}
    </motion.div>
  )
}

export default TypingTest