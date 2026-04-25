import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  title?: string
}

const ItemContainer = ({ children, title }: Props) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="grid  lg:grid-cols-2 grid-cols-1 gap-3">{children}</div>
    </>
  )
}

export default ItemContainer
