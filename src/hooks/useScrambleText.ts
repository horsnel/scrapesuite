import { useRef, useCallback } from 'react'

const CHARS = '!<>-_\\/[]{}--=+*^?#________'

interface QueueItem {
  from: string
  to: string
  start: number
  end: number
}

class ScrambleText {
  oldText: string
  queue: QueueItem[]
  frame: number
  isRunning: boolean
  useChaos: boolean

  constructor(initialText = '', useChaos = true) {
    this.oldText = initialText
    this.queue = []
    this.frame = 0
    this.isRunning = false
    this.useChaos = useChaos
  }

  setText(newText: string) {
    this.queue = []
    let oldI = 0
    let newI = 0

    while (oldI < this.oldText.length && newI < newText.length) {
      const from = this.oldText[oldI]
      const to = newText[newI]
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
      oldI++
      newI++
    }

    while (newI < newText.length) {
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from: '\u200B', to: newText[newI], start, end })
      newI++
    }

    while (oldI < this.oldText.length) {
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from: this.oldText[oldI], to: '\u200B', start, end })
      oldI++
    }

    this.oldText = newText
    this.frame = 0
    this.isRunning = true
  }

  update(): string {
    let output = ''
    let complete = 0

    for (let i = 0; i < this.queue.length; i++) {
      const q = this.queue[i]
      const to = q.to

      if (this.frame >= q.end) {
        output += to
        complete++
      } else if (this.frame >= q.start) {
        if (!this.useChaos && Math.random() < 0.28) {
          output += to
        } else {
          output += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
      } else {
        output += q.from
      }
    }

    if (complete === this.queue.length) {
      this.isRunning = false
    }

    this.frame++
    return output
  }
}

export function useScrambleText() {
  const scrambleRef = useRef<ScrambleText | null>(null)
  const rafRef = useRef<number>(0)

  const scramble = useCallback((
    element: HTMLElement,
    targetText: string,
    onComplete?: () => void
  ) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    if (!scrambleRef.current) {
      scrambleRef.current = new ScrambleText('', true)
    }

    scrambleRef.current.setText(targetText)

    const animate = () => {
      if (!scrambleRef.current) return
      const text = scrambleRef.current.update()
      element.textContent = text

      if (scrambleRef.current.isRunning) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        element.textContent = targetText
        onComplete?.()
      }
    }

    animate()
  }, [])

  return scramble
}
