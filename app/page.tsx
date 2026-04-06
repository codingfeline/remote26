import prisma from '@/lib/prisma'
import MainPage from './components/MainPage'
import FilterCustomers from './customer/_components/filterCustomersList'

export default async function Home() {
  const customers = await prisma.customer.findMany()
  const names = customers.map(c => ({ name: c.name, id: c.id }))

  return (
    <MainPage>
      <FilterCustomers names={names} requireSearch={false} />
      {/* <div className="flex justify-center flex-wrap items-center gap-1 ">
        <CustomerList />
      </div> */}
    </MainPage>
  )
}
