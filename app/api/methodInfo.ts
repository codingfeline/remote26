import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MethodInfoSchema } from './schema';

export async function PATCH(req: NextRequest, { params }: { params: { id: string, mid: string } }) {
  try {
    const body = await req.json();
    const data = MethodInfoSchema.parse(body);

    const { id, mid } = params

    const customer = await prisma.customer.findUnique({
      where: { id: id },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const updatedMethod = customer.methodInfo.map((method) => {
      if (method.id === mid) {
        return {
          ...method,
          ...data,
        };
      }
      return method;
    })

    await prisma.customer.update({
      where: { id: id },
      data: {
        methodInfo: updatedMethod,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: z.flattenError(error) }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid data' }, { status: 500 });
  }
}