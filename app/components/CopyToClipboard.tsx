'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast' // or 'sonner'

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      toast.error('Clipboard not supported by your browser')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      toast.success(`Copied: ${text}`)
      return true
    } catch (error) {
      console.error('Copy failed', error)
      toast.error('Failed to copy to clipboard')
      setCopiedText(null)
      return false
    }
  }

  return { copy, copiedText }
}
