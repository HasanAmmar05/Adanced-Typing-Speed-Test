import React from 'react'

function DifficultySelector({ difficulty, setDifficulty }) {
  return (
    <div className="mb-4">
      <label htmlFor="difficulty" className="mr-2">
        Difficulty:
      </label>
      <select
        id="difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="p-2 border rounded dark:bg-gray-600 dark:text-white"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  )
}

export default DifficultySelector