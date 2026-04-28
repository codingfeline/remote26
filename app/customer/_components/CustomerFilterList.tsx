import prisma from '@/lib/prisma'
import FilterCustomers from './filterCustomersList'

interface Props {
  requireSearch?: boolean
}

const CustomerList = async ({ requireSearch }: Props) => {
  const customers = await prisma.customer.findMany()
  const names = customers.map(c => ({ name: c.name, id: c.id }))

  return (
    <>
      <FilterCustomers names={names} requireSearch={requireSearch} />
      {/* {customers.map((cust: Customer) => (
        <MyButton url={`/customer/${cust.id}`} label={cust.name} key={cust.id} />
      ))} */}
    </>
  )
}

export default CustomerList
