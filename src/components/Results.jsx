import React, { useState, useEffect } from 'react'
import ReactConfetti from 'react-confetti'

function Results({ wpm, accuracy }) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="mt-8 p-4 bg-green-100 dark:bg-green-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      <p className="text-xl">Words per minute: {wpm}</p>
      <p className="text-xl">Accuracy: {accuracy}%</p>
      {showConfetti && <ReactConfetti />}
    </div>
  )
}

export default Results