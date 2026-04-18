import { CustIDProp, MethodInfoSchema } from '@/app/api/schema';
import prisma from '@/lib/prisma';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest, { params }: CustIDProp) {
  try {
    const body = await req.json();
    const { customerId } = await params
    // validate request body
    const data = MethodInfoSchema.parse(body);

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // create new method info
    const newMethodInfo = {
      id: new ObjectId().toString(),
      methodName: data.methodName,
      url: data.url ?? "",
      username: data.username ?? "",
      password: data.password ?? "",
      notes: data.notes ?? "",
    }

    // add new method info to existing list
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        methodInfo: [
          ...customer.methodInfo,
          newMethodInfo,
        ]
      }
    })
    return NextResponse.json(newMethodInfo, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: z.flattenError(error), message: 'Validation failed' },
        { status: 400 }
      );
    }
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to add method' },
      { status: 500 }
    );
  }
}