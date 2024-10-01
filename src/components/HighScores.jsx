import React from 'react'
import { motion } from 'framer-motion'

function HighScores({ highScores = [], resetHighScores }) {
  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">High Scores</h2>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
          onClick={resetHighScores}
        >
          Reset High Scores
        </button>
      </div>
      {highScores.length > 0 ? (
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
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No high scores yet. Start typing to set some records!</p>
      )}
    </motion.div>
  )
}

export default HighScores