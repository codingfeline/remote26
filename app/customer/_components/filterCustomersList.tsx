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
          <div className="flex flex-wrap gap-2 md:flex-col md:flex-nowrap md:gap-0">
            {filtered.map(t => {
              const isActive = pathname === `/customer/${t.id}`
              return (
                <div key={t.id} className="flex items-center md:my-1">
                  <ButtonIcon
                    href={`/customer/${t.id}`}
                    Icon={isActive ? Eye : undefined}
                    classes="md:hidden"
                  >
                    {t.name}
                  </ButtonIcon>
                  <ButtonIcon href={`/customer/${t.id}`} classes="hidden md:flex">
                    {t.name}
                  </ButtonIcon>
                  {isActive && (
                    <Eye className="text-violet-600 ml-1 shrink-0 hidden md:inline" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterCustomersList
