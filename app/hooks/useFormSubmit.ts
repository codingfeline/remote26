'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type SubmitOptions = {
  url: string
  method?: 'post' | 'patch' | 'delete'
  onSuccessRedirect?: string
  onSuccess?: () => void
}

export function useFormSubmit<T>() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (data: T, options: SubmitOptions) => {
    const {
      url,
      method = 'post',
      onSuccessRedirect,
      onSuccess,
    } = options

    try {
      setSubmitting(true)
      setError(null)

      await axios.request({
        url,
        method,
        data,
      })

      if (onSuccessRedirect) {
        // router.push(onSuccessRedirect)
        // router.refresh()
      }

      if (onSuccess) onSuccess()
    } catch (err: any) {

      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Unexpected error'

      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    submit,
    submitting,
    error,
  }
}