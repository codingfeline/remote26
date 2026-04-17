import prisma from '@/lib/prisma'
import MainPage from '../components/MainPage'

const page = async () => {
  const customers = await prisma.customer.findMany()
  return (
    <MainPage>
      {customers.map(customer => (
        <div key={customer.id}>
          <h2>{customer.name}</h2>
          {/* <p>{customer.email}</p> */}
        </div>
      ))}
    </MainPage>
  )
}

export default page
