import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {

  try {
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        solution: true,
        methodInfo: true,
      }
    })
    return NextResponse.json(customers)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })

  }

}
