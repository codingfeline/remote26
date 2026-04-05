import { Container } from '@radix-ui/themes'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  bg?: string
}

const MainPage = ({ children, bg }: Props) => {
  return (
    <main className={`grow ${bg} p-5`}>
      <Container>{children}</Container>
    </main>
  )
}

export default MainPage
