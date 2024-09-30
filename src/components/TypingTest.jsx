import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Timer from './Timer'
import Results from './Results'
import DifficultySelector from './DifficultySelector'
import { generateParagraph } from '../utils/textGenerator'
import { analyzeText, calculateDifficulty } from '../utils/nlpUtils'
import { Chart } from 'react-chartjs-2'
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
  const inputRef = useRef(null)
  const intervalRef = useRef(null)


  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('highScores')) || []
    setHighScores(savedScores)
  }, [])

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
    setTimeLeft(calculateTime(analysis ? analysis.wordCount : 0))
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

  const handleStart = () => {
    setTimeLeft(calculateTime(textAnalysis ? textAnalysis.wordCount : 0))
    setUserInput('')
    setIsActive(true)
    setIsFinished(false)
    setWpmData([])
    setMistakes(0)
    inputRef.current.focus()
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserInput(value)

    // Count mistakes
    const newMistakes = value.split('').reduce((count, char, index) => {
      return count + (char !== text[index] ? 1 : 0)
    }, 0)
    setMistakes(newMistakes)

    if (value === text) {
      clearInterval(intervalRef.current)
      setIsActive(false)
      setIsFinished(true)
      saveHighScore()
    }
  }

  const calculateWPM = () => {
    const words = userInput.trim().split(/\s+/).length
    const minutes = (calculateTime(textAnalysis ? textAnalysis.wordCount : 0) - timeLeft) / 60
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
    const updatedHighScores = [...highScores, newScore].sort((a, b) => b.wpm - a.wpm).slice(0, 5)
    setHighScores(updatedHighScores)
    localStorage.setItem('highScores', JSON.stringify(updatedHighScores))
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
      {/* ... (previous JSX) */}
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
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">High Scores</h2>
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">WPM</th>
                <th className="px-4 py-2 text-left">Accuracy</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {highScores.map((score, index) => (
                <tr key={index} className="border-t border-gray-200 dark:border-gray-600">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-semibold">{score.wpm} WPM</td>
                  <td className="px-4 py-2">{score.accuracy}%</td>
                  <td className="px-4 py-2">{new Date(score.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TypingTest