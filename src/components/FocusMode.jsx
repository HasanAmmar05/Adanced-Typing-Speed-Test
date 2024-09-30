import React from 'react'
import { motion } from 'framer-motion'

function FocusMode({ isActive, text, userInput, inputRef, handleInputChange, toggleFocusMode }) {
  if (!isActive) return null

  return (
    <motion.div
      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-2xl w-full p-8">
        <p className="text-2xl mb-4 whitespace-pre-wrap leading-relaxed">
          {text.split('').map((char, index) => {
            let color = 'text-gray-400'
            if (index < userInput.length) {
              color = char === userInput[index] ? 'text-green-500' : 'text-red-500'
            }
            return <span key={index} className={color}>{char}</span>
          })}
        </p>
        <textarea
          ref={inputRef}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          autoFocus
        />
      </div>
      <button
        className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-200"
        onClick={toggleFocusMode}
      >
        Leave Focus Mode
      </button>
    </motion.div>
  )
}

export default FocusMode