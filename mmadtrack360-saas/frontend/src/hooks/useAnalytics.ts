import { useEffect } from 'react'

export function useAnalytics(event: string, data?: any) {
  useEffect(() => {
    // Replace with real analytics integration (e.g., Google Analytics, Mixpanel)
    window?.console?.log(`[Analytics] ${event}`, data)
  }, [event, data])
}
