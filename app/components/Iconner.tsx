import { IconProps } from '@radix-ui/themes'
import { ComponentType } from 'react'

interface Props {
  Icon: ComponentType<IconProps>
  func?: () => void
}

const WrIcon = ({ Icon, func }: Props) => {
  return (
    <div
      className={`text-2xl  ${func ? 'text-gray-500 hover:text-violet-700 cursor-pointer' : 'text-gray-700'}`}
    >
      {<Icon onClick={func} />}
    </div>
  )
}

export default WrIcon
