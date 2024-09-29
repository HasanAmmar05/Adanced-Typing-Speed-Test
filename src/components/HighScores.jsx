import React, { useState, useEffect } from 'react'

function HighScores() {
  const [highScores, setHighScores] = useState([])

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('highScores')) || []
    setHighScores(savedScores)
  }, [])

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">High Scores</h2>
      <ul className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        {highScores.map((score, index) => (
          <li key={index} className="mb-2">
            <span className="font-bold">{score.wpm} WPM</span> - Accuracy: {score.accuracy}%
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HighScores