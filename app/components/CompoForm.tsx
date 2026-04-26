import { PropsWithChildren } from 'react'

const CompoForm = ({ children }: PropsWithChildren) => {
  return <form className="flex flex-col gap-4 mt-4">{children}</form>
}

export default CompoForm
