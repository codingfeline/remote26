'use client'

import { BackButton, ButtonIcon, ErrorMessage, MyButton, Send } from '@/app/components'
import CompoForm from '@/app/components/CompoForm'
import { useFormSubmit } from '@/app/hooks/useFormSubmit'
import { SolutionSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SolutionSetup } from '@prisma/client'
import { Container, TextField } from '@radix-ui/themes'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type SolutionSetupFormData = z.infer<typeof SolutionSchema>

const SolutionSetupForm = ({ entry }: { entry?: SolutionSetup }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SolutionSetupFormData>({
    resolver: zodResolver(SolutionSchema),
  })

  const params = useParams()
  const { id, ssid } = params

  const { submit, submitting, error } = useFormSubmit<SolutionSetupFormData>()
  const onSubmit = handleSubmit(async data => {
    await submit(data, {
      url: entry
        ? `/api/customers/${id}/solution-setup/${ssid}`
        : `/api/customers/${id}/solution-setup`,
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

export default SolutionSetupForm
