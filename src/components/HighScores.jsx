import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function HighScores() {
  const [highScores, setHighScores] = useState([])

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('highScores')) || []
    setHighScores(savedScores)
  }, [])

  return (
    <motion.div 
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
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
  )
}

export default HighScores