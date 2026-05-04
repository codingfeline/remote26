'use client'

import { MyButton } from '@/app/components'
import ButtonIcon from '@/app/components/ButtonIcon'
import { Box, Container, Flex, TextField } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'

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
  const [searchTerm, setSearchTerm] = useState(() =>
    typeof window !== 'undefined' ? sessionStorage.getItem('customerFilter') ?? '' : ''
  )
  const pathname = usePathname()

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    sessionStorage.setItem('customerFilter', value)
  }

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
              value={searchTerm} onChange={e => handleSearch(e.target.value)}
            >
              <TextField.Slot>
                <FaSearch height="16" width="16" />
              </TextField.Slot>
              {searchTerm && (
                <TextField.Slot side="right">
                  <FaTimes className="cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => handleSearch('')} />
                </TextField.Slot>
              )}
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
              value={searchTerm} onChange={e => handleSearch(e.target.value)}
            >
              <TextField.Slot>
                <FaSearch height="16" width="16" />
              </TextField.Slot>
              {searchTerm && (
                <TextField.Slot side="right">
                  <FaTimes className="cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => handleSearch('')} />
                </TextField.Slot>
              )}
            </TextField.Root>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-col md:flex-nowrap md:gap-0">
            {filtered.map(t => {
              const isActive = pathname === `/customer/${t.id}`
              return (
                <div key={t.id} className="flex items-center md:my-1">
                  <ButtonIcon href={`/customer/${t.id}`} active={isActive}>
                    {t.name}
                  </ButtonIcon>
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
