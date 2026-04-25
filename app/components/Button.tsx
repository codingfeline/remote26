'use client'

import { IconProps } from '@radix-ui/themes'
import Link from 'next/link'
import { ComponentType } from 'react'

interface Prop {
  url?: string
  label: string
  Icon?: ComponentType<IconProps>
  children?: React.ReactNode
  iconPosition?: 'left' | 'right'
  click?: () => void
  secondary?: boolean
}

const MyButton = ({ url, label, Icon, iconPosition, click, secondary }: Prop) => {
  return (
    <button className={`flex items-center gap-2 justify-center `} onClick={click}>
      <div
        className={` ${secondary ? 'bg-gray-300 hover:border-gray-400 border-gray-300 border' : 'bg-violet-200 hover:bg-violet-300'} p-1 cursor-pointer  px-2 rounded-sm flex items-center gap-2 justify-center `}
      >
        {iconPosition === 'left' && Icon && <Icon />}
        {url ? <Link href={`${url}`}>{label}</Link> : label}
        {iconPosition === 'right' && Icon && <Icon />}
      </div>
    </button>
  )
}

export default MyButton
