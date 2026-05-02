'use client'

import { BackButton, ButtonIcon, ErrorMessage, MyButton, Send } from '@/app/components'
import CompoForm from '@/app/components/CompoForm'
import { useFormSubmit } from '@/app/hooks/useFormSubmit'
import { DeviceSetupSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { DeviceSetup } from '@prisma/client'
import { Container, TextField } from '@radix-ui/themes'
import { useParams } from 'next/navigation'
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
  })

  const params = useParams()
  const { id, dsid } = params

  const { submit, submitting, error } = useFormSubmit<DeviceSetupFormData>()
  const onSubmit = handleSubmit(async data => {
    await submit(data, {
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
          <TextField.Root
            defaultValue={entry?.screenshot}
            placeholder="Screenshot"
            id="screenshot"
            {...register('screenshot')}
          />
          <ErrorMessage>{errors.screenshot?.message}</ErrorMessage>
        </label>
        <label htmlFor="path">
          Path
          <TextField.Root
            defaultValue={entry?.path}
            placeholder="Path"
            id="path"
            {...register('path')}
          />
          <ErrorMessage>{errors.path?.message}</ErrorMessage>
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
