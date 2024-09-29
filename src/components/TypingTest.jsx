import React, { useState, useEffect, useRef } from 'react'
import Timer from './Timer'
import Results from './Results'
import DifficultySelector from './DifficultySelector'
import { generateParagraph } from '../utils/textGenerator'

function TypingTest() {
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [difficulty, setDifficulty] = useState('medium')
  const [isFinished, setIsFinished] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setText(generateParagraph(difficulty))
  }, [difficulty])

  const handleStart = () => {
    setStartTime(Date.now())
    setEndTime(null)
    setUserInput('')
    setIsFinished(false)
    inputRef.current.focus()
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserInput(value)

    if (value === text) {
      setEndTime(Date.now())
      setIsFinished(true)
    }
  }

  const calculateWPM = () => {
    if (startTime && endTime) {
      const minutes = (endTime - startTime) / 60000
      const words = userInput.trim().split(/\s+/).length
      return Math.round(words / minutes)
    }
    return 0
  }

  const calculateAccuracy = () => {
    const correctChars = userInput.split('').filter((char, index) => char === text[index]).length
    return Math.round((correctChars / text.length) * 100)
  }

  return (
    <div className="mb-8">
      <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-lg mb-4">{text}</p>
        <textarea
          ref={inputRef}
          className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          disabled={isFinished}
        />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleStart}
        >
          Start Test
        </button>
        <Timer startTime={startTime} endTime={endTime} />
      </div>
      {isFinished && (
        <Results wpm={calculateWPM()} accuracy={calculateAccuracy()} />
      )}
    </div>
  )
}

export default TypingTest