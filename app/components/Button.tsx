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
  disable?: boolean
}

const MyButton = ({
  url,
  label,
  Icon,
  iconPosition,
  click,
  secondary,
  disable,
}: Prop) => {
  return (
    <button
      className={`flex items-center gap-1 p-1 px-2 bg-gray-200 self-center rounded-sm justify-center ${disable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${secondary ? 'bg-gray-300 hover:border-gray-400 border-gray-300 border' : 'bg-violet-200 hover:bg-violet-300'} `}
      onClick={click}
    >
      {iconPosition === 'left' && Icon && <Icon />}
      {url ? <Link href={`${url}`}>{label}</Link> : label}
      {iconPosition === 'right' && Icon && <Icon />}
    </button>
  )
}

export default MyButton
