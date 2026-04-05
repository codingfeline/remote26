import prisma from '@/lib/prisma'
import FilterCustomers from '../customer/_components/filterCustomers'

const CustomerList = async () => {
  const customers = await prisma.customer.findMany()
  const names = customers.map(c => ({ name: c.name, id: c.id }))

  return (
    <>
      <FilterCustomers names={names} />
      {/* {customers.map((cust: Customer) => (
        <MyButton url={`/customer/${cust.id}`} label={cust.name} key={cust.id} />
      ))} */}
    </>
  )
}

export default CustomerList
