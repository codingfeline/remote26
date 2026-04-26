import { IconProps } from '@radix-ui/themes'
import Link from 'next/link'
import { ComponentType } from 'react'

interface Props {
  Icon: ComponentType<IconProps>
  func?: () => void
  href?: string
}

const Iconner = ({ Icon, func, href }: Props) => {
  return (
    <div
      className={`text-2xl  ${func || href ? 'inline-block text-gray-500 hover:text-violet-700 cursor-pointer' : 'text-gray-700'}`}
    >
      {href ? (
        <Link href={href}>
          <Icon />
        </Link>
      ) : (
        <Icon onClick={func} />
      )}
    </div>
  )
}

export default Iconner
