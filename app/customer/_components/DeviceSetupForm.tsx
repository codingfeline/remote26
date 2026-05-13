'use client'

import { BackButton, ButtonIcon, ErrorMessage, MyButton, Send } from '@/app/components'
import CompoForm from '@/app/components/CompoForm'
import ScreenshotPaste from '@/app/components/ScreenshotPaste'
import { useFormSubmit } from '@/app/hooks/useFormSubmit'
import { DeviceSetupSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { DeviceSetup } from '@prisma/client'
import { Container, TextField } from '@radix-ui/themes'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type DeviceSetupFormData = z.infer<typeof DeviceSetupSchema>

const DeviceSetupForm = ({ entry }: { entry?: DeviceSetup }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeviceSetupFormData>({
    resolver: zodResolver(DeviceSetupSchema),
    defaultValues: { screenshot: entry?.screenshot ?? '' },
  })

  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const params = useParams()
  const { id, dsid } = params

  const { submit, submitting, error } = useFormSubmit<DeviceSetupFormData>()
  const onSubmit = handleSubmit(async data => {
    setUploadError(null)
    let screenshot = data.screenshot
    if (pendingFile) {
      try {
        const fd = new FormData()
        fd.append('file', pendingFile)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `Upload failed (${res.status})`)
        }
        const { url } = await res.json()
        screenshot = url
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed')
        return
      }
    }
    await submit({ ...data, screenshot }, {
      url: entry
        ? `/api/customers/${id}/device-setup/${dsid}`
        : `/api/customers/${id}/device-setup`,
      method: entry ? 'patch' : 'post',
      onSuccessRedirect: `/customer/${id}`,
    })
  })

  return (
    <Container>
      <ButtonIcon href={`/customer/${id}`} Icon={BackButton}>
        Back
      </ButtonIcon>
      <CompoForm>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {uploadError && <ErrorMessage>{uploadError}</ErrorMessage>}
        <label htmlFor="comment">
          Comment
          <TextField.Root
            defaultValue={entry?.comment}
            placeholder="Comment"
            id="comment"
            {...register('comment')}
          />
          <ErrorMessage>{errors.comment?.message}</ErrorMessage>
        </label>
        <label htmlFor="screenshot">
          Screenshot
          <ScreenshotPaste
            url={entry?.screenshot}
            file={pendingFile}
            onFileChange={setPendingFile}
          />
          <ErrorMessage>{errors.screenshot?.message}</ErrorMessage>
        </label>
        <MyButton
          disable={submitting}
          label={submitting ? 'Saving...' : 'Save'}
          Icon={Send}
          iconPosition="right"
          click={onSubmit}
        />
      </CompoForm>
    </Container>
  )
}

export default DeviceSetupForm
