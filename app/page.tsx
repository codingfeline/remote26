import prisma from '@/lib/prisma'
import MainPage from './components/MainPage'
import FilterCustomers from './customer/_components/filterCustomers'

export default async function Home() {
  const customers = await prisma.customer.findMany()
  const names = customers.map(c => ({ name: c.name, id: c.id }))

  return (
    <MainPage>
      <FilterCustomers names={names} />
      {/* <div className="flex justify-center flex-wrap items-center gap-1 ">
        <CustomerList />
      </div> */}
    </MainPage>
  )
}
