import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Timer from './Timer'
import Results from './Results'
import DifficultySelector from './DifficultySelector'
import FocusMode from './FocusMode'
import HighScores from './HighScores'
import { generateParagraph } from '../utils/textGenerator'
import { analyzeText, calculateDifficulty } from '../utils/nlpUtils'
import { Chart } from 'react-chartjs-2'
import { VolumeX, Volume2 } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function TypingTest() {
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const [isFinished, setIsFinished] = useState(false)
  const [textAnalysis, setTextAnalysis] = useState(null)
  const [wpmData, setWpmData] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const [highScores, setHighScores] = useState([])
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [wordStreak, setWordStreak] = useState(0)
  const [maxWordStreak, setMaxWordStreak] = useState(0)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const inputRef = useRef(null)
  const intervalRef = useRef(null)

  const keySound = new Audio('/Key_Press_Sound.wav')

  
  const calculateTime = useCallback((wordCount) => {
    const baseTime = 30 // Base time for 50 words
    const baseWords = 50
    return Math.max(30, Math.round((wordCount / baseWords) * baseTime))
  }, [])

  useEffect(() => {
    const newText = generateParagraph(difficulty)
    setText(newText)
    const analysis = analyzeText(newText)
    setTextAnalysis(analysis)
    setTimeLeft(calculateTime(analysis.wordCount))
  }, [difficulty, calculateTime])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            clearInterval(intervalRef.current)
            setIsFinished(true)
            saveHighScore()
            return 0
          }
          return prevTimeLeft - 1
        })
        setWpmData((prevData) => [...prevData, calculateWPM()])
      }, 1000)
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current)
      setIsFinished(true)
      saveHighScore()
    }
    return () => clearInterval(intervalRef.current)
  }, [isActive, timeLeft])

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('highScores')) || []
    setHighScores(savedScores)
  }, [])

  const handleStart = () => {
    setTimeLeft(calculateTime(textAnalysis.wordCount))
    setUserInput('')
    setIsActive(true)
    setIsFinished(false)
    setWpmData([])
    setMistakes(0)
    setWordStreak(0)
    setMaxWordStreak(0)
    inputRef.current.focus()
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserInput(value)

    if (isSoundEnabled) {
      keySound.currentTime = 0
      keySound.play()
    }

    const words = text.split(' ')
    const typedWords = value.split(' ')
    let newMistakes = 0
    let newWordStreak = 0

    for (let i = 0; i < typedWords.length; i++) {
      if (typedWords[i] === words[i]) {
        newWordStreak++
      } else {
        newMistakes += 1
        break
      }
    }

    setMistakes(newMistakes)
    setWordStreak(newWordStreak)
    setMaxWordStreak(Math.max(maxWordStreak, newWordStreak))

    if (value === text) {
      clearInterval(intervalRef.current)
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
    const totalChars = userInput.length
    const correctChars = totalChars - mistakes
    return Math.round((correctChars / totalChars) * 100) || 0
  }

  const saveHighScore = () => {
    const wpm = calculateWPM()
    const accuracy = calculateAccuracy()
    const newScore = { wpm, accuracy, date: new Date().toISOString(), difficulty }
    const updatedHighScores = [...highScores, newScore]
      .sort((a, b) => b.wpm - a.wpm)
      .filter((score, index, self) => 
        index === self.findIndex((t) => (
          t.wpm === score.wpm && t.accuracy === score.accuracy && t.date === score.date
        ))
      )
      .slice(0, 5)
    setHighScores(updatedHighScores)
    localStorage.setItem('highScores', JSON.stringify(updatedHighScores))
  }

  const resetHighScores = () => {
    setHighScores([])
    localStorage.removeItem('highScores')
  }

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode)
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'WPM Over Time',
      },
    },
  }

  const chartData = {
    labels: wpmData.map((_, index) => index + 1),
    datasets: [
      {
        label: 'WPM',
        data: wpmData,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
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
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
          >
            {isSoundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-200"
            onClick={toggleFocusMode}
          >
            {isFocusMode ? 'Leave Focus Mode' : 'Enter Focus Mode'}
          </button>
        </div>
      </div>
      {textAnalysis && (
        <motion.div 
          className="mb-4 p-4 bg-gray-800 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-white">Text Analysis</h3>
          <div className="grid grid-cols-2 gap-2 text-gray-300">
            <p>Word Count: {textAnalysis.wordCount}</p>
            <p>Unique Words: {textAnalysis.uniqueWordCount}</p>
            <p>Avg. Word Length: {textAnalysis.averageWordLength.toFixed(2)}</p>
            <p>Lexical Density: {textAnalysis.lexicalDensity.toFixed(2)}</p>
          </div>
          <p className="mt-2 text-white">Calculated Difficulty: <span className="font-semibold capitalize">{calculateDifficulty(text)}</span></p>
        </motion.div>
      )}
      <motion.div 
        className="mb-4 p-4 bg-gray-800 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p className="text-lg mb-4 whitespace-pre-wrap leading-relaxed text-gray-300">
          {text.split('').map((char, index) => {
            let color = 'text-gray-300'
            if (index < userInput.length) {
              color = char === userInput[index] ? 'text-green-500' : 'text-red-500'
            }
            return <span key={index} className={color}>{char}</span>
          })}
        </p>
        <textarea
          ref={inputRef}
          className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          disabled={!isActive || isFinished}
        />
      </motion.div>
      <motion.div 
        className="flex justify-between items-center mb-4"
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
        <div className="text-lg">
          <span className="font-bold">Word Streak:</span> {wordStreak}
          <span className="ml-4 font-bold">Max Streak:</span> {maxWordStreak}
        </div>
      </motion.div>
      {isFinished && (
        <Results wpm={calculateWPM()} accuracy={calculateAccuracy()} />
      )}
      {wpmData.length > 0 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Chart type="line" options={chartOptions} data={chartData} />
        </motion.div>
      )}
      <HighScores highScores={highScores} resetHighScores={resetHighScores} />
      <FocusMode
        isActive={isFocusMode}
        text={text}
        userInput={userInput}
        inputRef={inputRef}
        handleInputChange={handleInputChange}
        toggleFocusMode={toggleFocusMode}
      />
    </motion.div>
  )
}

export default TypingTest