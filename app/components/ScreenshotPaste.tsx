'use client'

import { ClipboardEvent, useEffect, useState } from 'react'

interface Props {
  url?: string
  file: File | null
  onFileChange: (file: File) => void
}

const ScreenshotPaste = ({ url, file, onFileChange }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const items = Array.from(e.clipboardData.items)
    const imageItem = items.find(i => i.type.startsWith('image/'))
    if (!imageItem) return

    e.preventDefault()
    const pasted = imageItem.getAsFile()
    if (pasted) onFileChange(pasted)
  }

  const displaySrc = previewUrl ?? (url ? `/api/blob?url=${encodeURIComponent(url)}` : null)

  return (
    <div
      tabIndex={0}
      onPaste={handlePaste}
      className="border-2 border-dashed border-violet-400 rounded-md p-3 min-h-25 focus:outline-none focus:border-violet-600 cursor-text bg-white"
    >
      {displaySrc ? (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displaySrc} alt="Screenshot" className="max-h-64 rounded border" />
          {file && (
            <p className="text-xs text-violet-600">
              Pending upload — will save when you click Save.
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          Click here, then press Ctrl+V to paste a screenshot
        </p>
      )}
    </div>
  )
}

export default ScreenshotPaste
