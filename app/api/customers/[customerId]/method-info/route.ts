import { MethodInfoSchema } from '@/app/api/schema';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest, { params }: { params: Promise<{ customerId: string }> }) {

  const body = await req.json();
  const data = MethodInfoSchema.parse(body);
  const customerId = (await params).customerId

  try {
    // create new method info
    const newMethod = {
      id: crypto.randomUUID(),
      ...data,
    };

    // update customer with new method info
    await prisma.customer.update({
      where: { id: customerId },
      data: newMethod,
    });

    return NextResponse.json({ success: true, methodId: newMethod.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: z.flattenError(error) }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to add method' }, { status: 500 });
  }
}