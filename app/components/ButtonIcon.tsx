import { IconProps } from '@radix-ui/themes'
import Link from 'next/link'
import { ComponentType, ReactNode } from 'react'

interface Prop {
  href: string
  Icon?: ComponentType<IconProps>
  children: ReactNode
  classes?: string
  active?: boolean
}

const ButtonIcon = ({ href, Icon, children, classes, active }: Prop) => {
  return (
    <div className={`flex  ${classes}`}>
      <Link
        href={href}
        className={`${active ? 'bg-violet-400 hover:bg-violet-500' : 'bg-violet-200 hover:bg-violet-300'} flex items-center gap-2 p-1 px-2 rounded-sm`}
      >
        {Icon && <Icon />} {children}
      </Link>
    </div>
  )
}

export default ButtonIcon
