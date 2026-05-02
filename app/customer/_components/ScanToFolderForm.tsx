'use client'

import { BackButton, ButtonIcon, ErrorMessage, MyButton, Send } from '@/app/components'
import CompoForm from '@/app/components/CompoForm'
import { useFormSubmit } from '@/app/hooks/useFormSubmit'
import { ScanToFolderSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ScanToFolder } from '@prisma/client'
import { Container, TextField } from '@radix-ui/themes'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ScanToFolderFormData = z.infer<typeof ScanToFolderSchema>

const ScanToFolderForm = ({ entry }: { entry?: ScanToFolder }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScanToFolderFormData>({
    resolver: zodResolver(ScanToFolderSchema),
  })

  const params = useParams()
  const { id, stfid } = params

  const { submit, submitting, error } = useFormSubmit<ScanToFolderFormData>()
  const onSubmit = handleSubmit(async data => {
    await submit(data, {
      url: entry
        ? `/api/customers/${id}/scan-to-folder/${stfid}`
        : `/api/customers/${id}/scan-to-folder`,
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
        <label htmlFor="hostname">
          Hostname
          <TextField.Root
            defaultValue={entry?.hostname}
            placeholder="Hostname"
            id="hostname"
            {...register('hostname')}
          />
          <ErrorMessage>{errors.hostname?.message}</ErrorMessage>
        </label>
        <label htmlFor="folder">
          Folder
          <TextField.Root
            defaultValue={entry?.folder ?? ''}
            placeholder="Folder"
            id="folder"
            {...register('folder')}
          />
          <ErrorMessage>{errors.folder?.message}</ErrorMessage>
        </label>
        <label htmlFor="username">
          Username
          <TextField.Root
            defaultValue={entry?.username}
            placeholder="Username"
            id="username"
            {...register('username')}
          />
          <ErrorMessage>{errors.username?.message}</ErrorMessage>
        </label>
        <label htmlFor="password">
          Password
          <TextField.Root
            defaultValue={entry?.password}
            placeholder="Password"
            id="password"
            {...register('password')}
          />
          <ErrorMessage>{errors.password?.message}</ErrorMessage>
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

export default ScanToFolderForm
