import { useEffect, useState } from 'react'

export const useCountUp = (target: number, duration = 800) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (target === 0) { setCurrent(0); return }

    const startTime = Date.now()
    const startValue = 0

    const tick = () => {
      const elapsed  = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic — decelerates near end
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(startValue + (target - startValue) * eased))

      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return current
}

