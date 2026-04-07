import { useEffect, useRef } from 'react'
import { useS900Store } from '../store'
import { useAppStore } from '../store'

export function useS900Timer() {
  const { triggerPopup, skipPopup, showPopup, popupTimestamp, addSnapshot } = useS900Store()
  const { mode, settings } = useAppStore()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!settings.s900Enabled || mode === 'afk') return

    const intervalMs = settings.s900IntervalMinutes * 60 * 1000

    timerRef.current = setInterval(() => {
      if (mode === 'deep_rest') {
        // Auto-answer with deep_rest
        addSnapshot({
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          activity: 'Deep Rest',
          category: 'deep_rest',
          edited: false,
        })
      } else {
        triggerPopup()
      }
    }, intervalMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [mode, settings.s900Enabled, settings.s900IntervalMinutes])

  // Auto-dismiss after 60 seconds
  useEffect(() => {
    if (showPopup && popupTimestamp) {
      dismissTimerRef.current = setTimeout(() => {
        skipPopup(popupTimestamp)
      }, 60_000)
    }
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    }
  }, [showPopup, popupTimestamp])
}
