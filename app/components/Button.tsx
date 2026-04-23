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
}

const MyButton = ({ url, label, Icon, iconPosition }: Prop) => {
  return (
    <button className=" flex items-center gap-2 justify-center ">
      <div className="cursor-pointer bg-violet-200 p-1 hover:bg-violet-300 px-2 rounded-sm flex items-center gap-2 justify-center ">
        {iconPosition === 'left' && Icon && <Icon />}
        {url ? <Link href={`${url}`}>{label}</Link> : label}
        {iconPosition === 'right' && Icon && <Icon />}
      </div>
    </button>
  )
}

export default MyButton
