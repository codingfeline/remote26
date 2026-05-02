'use client'

import { BackButton, ButtonIcon, ErrorMessage, MyButton, Send } from '@/app/components'
import CompoForm from '@/app/components/CompoForm'
import { CustomerSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Select, TextField } from '@radix-ui/themes'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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

type CustomerFormData = z.infer<typeof CustomerSchema>

const NewCustomerForm = () => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(CustomerSchema),
  })

  const onSubmit = handleSubmit(async data => {
    try {
      setSubmitting(true)
      setError(null)
      const res = await axios.post('/api/customers', data)
      router.push(`/customer/${res.data.id}`)
      router.refresh()
    } catch {
      setError('Failed to create customer')
      setSubmitting(false)
    }
  })

  return (
    <Container>
      <ButtonIcon href="/" Icon={BackButton}>
        Back
      </ButtonIcon>
      <CompoForm>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <label htmlFor="name">
          Name
          <TextField.Root placeholder="Customer name" id="name" {...register('name')} />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </label>
        <label htmlFor="solution">
          Solution:
          <div className="mt-2">
            <Select.Root onValueChange={val => setValue('solution', val)}>
              <Select.Trigger id="solution" placeholder="Select solution" />
              <Select.Content>
                {SOLUTIONS.map(s => (
                  <Select.Item key={s} value={s}>
                    {s}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <ErrorMessage>{errors.solution?.message}</ErrorMessage>
        </label>
        <MyButton
          disable={submitting}
          label={submitting ? 'Creating...' : 'Create'}
          Icon={Send}
          iconPosition="right"
          click={onSubmit}
        />
      </CompoForm>
    </Container>
  )
}

export default NewCustomerForm
