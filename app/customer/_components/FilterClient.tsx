'use client'

import { useMediaQuery } from '@/app/hooks/useMediaQuery'
import FilterCustomers from './filterCustomersList'

interface Props {
  names: { name: string; id: string }[]
}

const ResponsiveFilterCustomers = ({ names }: Props) => {
  // Tailwind md breakpoint = 768px
  const isMdUp = useMediaQuery('(min-width: 768px)')

  return (
    <FilterCustomers
      names={names}
      requireSearch={!isMdUp} // 👈 small screens require typing
    />
  )
}

export default ResponsiveFilterCustomers
