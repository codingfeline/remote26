'use client'

import { BackButton, ButtonIcon, ErrorMessage, MyButton, Send } from '@/app/components'
import CompoForm from '@/app/components/CompoForm'
import { useFormSubmit } from '@/app/hooks/useFormSubmit'
import { ContactInfoSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Contact } from '@prisma/client'
import { Container, TextField } from '@radix-ui/themes'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ContactFormData = z.infer<typeof ContactInfoSchema>

const ContactForm = ({ contact }: { contact?: Contact }) => {
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactInfoSchema),
  })
  const params = useParams()
  const { id, ctid } = params

  const { submit, submitting, error } = useFormSubmit<ContactFormData>()
  const onSubmit = handleSubmit(async data => {
    await submit(data, {
      url: contact
        ? `/api/customers/${id}/contact/${ctid}`
        : `/api/customers/${id}/contact`,
      method: contact ? 'patch' : 'post',
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
        <label htmlFor="name">
          Name
          <TextField.Root
            defaultValue={contact?.name}
            placeholder="Name"
            id="name"
            {...register('name')}
          />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </label>
        <label htmlFor="tel">
          Tel
          <TextField.Root
            defaultValue={contact?.tel}
            placeholder="Phone"
            id="tel"
            {...register('tel')}
          />
          <ErrorMessage>{errors.tel?.message}</ErrorMessage>
        </label>
        <label htmlFor="email">
          Email
          <TextField.Root
            defaultValue={contact?.email}
            placeholder="Email"
            id="email"
            {...register('email')}
          />
          <ErrorMessage>{errors.email?.message}</ErrorMessage>
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

export default ContactForm
