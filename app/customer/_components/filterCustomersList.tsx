'use client'

import { Eye, MyButton } from '@/app/components'
import ButtonIcon from '@/app/components/ButtonIcon'
import { Box, Container, Flex, TextField } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

interface names {
  name: string
  id: string
}

interface Prop {
  names: names[]
  requireSearch?: boolean
  horizontal?: boolean
}

const FilterCustomersList = ({ names, requireSearch, horizontal }: Prop) => {
  const [searchTerm, setSearchTerm] = useState('')
  const pathname = usePathname()

  const filtered = names.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  // const showList = requireSearch ? searchTerm !== '' : true

  return (
    <div className="w-full">
      <MyButton secondary label="Add Customer" url="/customer/new" />
      {horizontal ? (
        <div className="my-2">
          <div className="mb-2">
            <TextField.Root
              placeholder="filter customer"
              onChange={e => setSearchTerm(e.target.value)}
            >
              <TextField.Slot>
                <FaSearch height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </div>
          <div className="flex flex-wrap gap-2">
            {filtered.map(t => (
              <div key={t.id} className="flex items-center">
                <ButtonIcon href={`/customer/${t.id}`}>{t.name}</ButtonIcon>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Flex my="2">
          <Container size="3">
            <Box width="5" className="max-w-5xl">
              <TextField.Root
                placeholder="filter customer"
                onChange={e => setSearchTerm(e.target.value)}
              >
                <TextField.Slot>
                  <FaSearch height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
            {filtered.map(t => (
              <Flex key={t.id} my="1" wrap="nowrap" align="center">
                <ButtonIcon href={`/customer/${t.id}`}>{t.name}</ButtonIcon>
                {pathname === `/customer/${t.id}` && (
                  <Eye className="text-violet-600 ml-1 shrink-0" />
                )}
              </Flex>
            ))}
          </Container>
        </Flex>
      )}
    </div>
  )
}

export default FilterCustomersList
