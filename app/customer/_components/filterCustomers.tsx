'use client'

import ButtonIcon from '@/app/components/ButtonIcon'
import { Box, Container, Flex, TextField } from '@radix-ui/themes'
import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

interface names {
  name: string
  id: string
}

interface Prop {
  names: names[]
}

const FilterCustomers = ({ names }: Prop) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = names.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <Flex my="2">
        {/* <Flex my="2" className="place-self-center py-1" direction="column"> */}
        <Container size="3">
          <Box width="5" className="max-w-5xl">
            <TextField.Root
              placeholder="find customer"
              onChange={e => setSearchTerm(e.target.value)}
            >
              <TextField.Slot>
                <FaSearch height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Box>

          {filtered.map(t => (
            <div key={t.id}>
              <Flex my="1" wrap="nowrap">
                <ButtonIcon href={`/customer/${t.id}`}>{t.name}</ButtonIcon>
              </Flex>
            </div>
          ))}
        </Container>
      </Flex>
    </div>
  )
}

export default FilterCustomers
