'use client'

import { Toaster } from 'react-hot-toast' // or 'sonner'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Global styles/options go here
        duration: 3000,
      }}
    />
  )
}
