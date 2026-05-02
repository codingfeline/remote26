import { CustomerSchema } from '@/app/schema';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        solution: true,
        contact: true,
      }
    })
    return NextResponse.json(customers)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CustomerSchema.parse(body);

    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        solution: data.solution,
        date: new Date(),
        version: 0,
      }
    })

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: z.flattenError(error), message: 'Validation failed' },
        { status: 400 }
      );
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
