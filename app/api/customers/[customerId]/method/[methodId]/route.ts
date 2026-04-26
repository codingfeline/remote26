import { NextRequest, NextResponse, prisma } from '@/app/api';
import { CustomerAllProps, MethodInfoSchema } from '@/app/schema';
import { z } from 'zod';

export async function PATCH(req: NextRequest, { params }: CustomerAllProps) {
  try {
    const body = await req.json();

    // validate input
    const data = MethodInfoSchema.parse(body);

    const { customerId, methodId } = await params

    // get existing customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // update method info
    const updatedMethod = customer.methodInfo.map((method) => {
      if (method.id === methodId) {
        return {
          ...method,
          ...data,
        };
      }
      return method;
    })

    // save entire array
    await prisma.customer.update({
      where: { id: customerId },
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