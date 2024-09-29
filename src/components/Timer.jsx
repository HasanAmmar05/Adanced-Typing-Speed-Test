import React, { useState, useEffect } from 'react'

function Timer({ startTime, endTime }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval
    if (startTime && !endTime) {
      interval = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [startTime, endTime])

  return <div className="text-xl font-bold">{time}s</div>
}

export default Timer