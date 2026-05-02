'use client'

import { BackButton, ButtonIcon, ErrorMessage, MyButton, Send } from '@/app/components'
import CompoForm from '@/app/components/CompoForm'
import { useFormSubmit } from '@/app/hooks/useFormSubmit'
import { CustomerSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Select, TextField } from '@radix-ui/themes'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const SOLUTIONS = [
  'Cirrato',
  'SafeQ',
  'PaperCut',
  'Equitrac',
  'Safecom',
  'PaperCut Hive',
  'Printix',
]

type CustomerEditFormData = z.infer<typeof CustomerSchema>

const EditCustomerForm = ({ name, solution }: { name: string; solution: string }) => {
  const { id } = useParams()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerEditFormData>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: { name, solution },
  })

  const { submit, submitting, error } = useFormSubmit<CustomerEditFormData>()
  const onSubmit = handleSubmit(async data => {
    await submit(data, {
      url: `/api/customers/${id}`,
      method: 'patch',
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
            id="name"
            placeholder="Customer name"
            {...register('name')}
          />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </label>
        <label htmlFor="solution">
          Solution
          <div className="mt-1">
            <Select.Root
              defaultValue={solution}
              onValueChange={val => setValue('solution', val)}
            >
              <Select.Trigger id="solution" />
              <Select.Content>
                {SOLUTIONS.map(s => (
                  <Select.Item key={s} value={s}>{s}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <ErrorMessage>{errors.solution?.message}</ErrorMessage>
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

export default EditCustomerForm
