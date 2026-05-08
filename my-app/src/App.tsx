import { useState, useRef } from 'react'
import './App.css'
import { useWebHaptics } from 'web-haptics/react'

type FlyingEmoji = {
  id: number
  emoji: string
  left: number
  duration: number
  delay: number
  size: number
  drift: number
}

const EMOJIS = ['💀', '🔥', '😂', '💯', '🤡', '👻', '🥶', '😈', '🚨', '📢']

function App() {
  const [emojis, setEmojis] = useState<FlyingEmoji[]>([])
  const [spamCount, setSpamCount] = useState(0)
  const idRef = useRef(0)

  const { trigger } = useWebHaptics()

  const handleSpam = () => {
    trigger([{ duration: 40 }], { intensity: 1 })

    const burst: FlyingEmoji[] = Array.from({ length: 12 }).map(() => {
      idRef.current += 1
      return {
        id: idRef.current,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        left: Math.random() * 90 + 5,
        duration: 1.6 + Math.random() * 1.2,
        delay: Math.random() * 0.25,
        size: 28 + Math.random() * 36,
        drift: (Math.random() - 0.5) * 60,
      }
    })

    setEmojis((prev) => [...prev, ...burst])
    setSpamCount((c) => c + 1)

    const cutoff = idRef.current
    setTimeout(() => {
      setEmojis((prev) => prev.filter((e) => e.id > cutoff - 60))
    }, 3000)
  }

  return (
    <div className="spam-page">
      <header className="spam-header">
        <h1>SEND THE SPAM</h1>
        <p>Pres dem lidt mere 💀💀💀💀</p>
        <span className="spam-counter">Spams sendt: {spamCount}</span>
      </header>

      <main className="spam-stage">
        {emojis.map((e) => (
          <span
            key={e.id}
            className="flying-emoji"
            style={{
              left: `${e.left}%`,
              fontSize: `${e.size}px`,
              animationDuration: `${e.duration}s`,
              animationDelay: `${e.delay}s`,
              ['--drift' as string]: `${e.drift}px`,
            }}
          >
            {e.emoji}
          </span>
        ))}

        <button className="spam-button" onClick={handleSpam}>
          SPAM
        </button>
      </main>
    </div>
  )
}

export default App
