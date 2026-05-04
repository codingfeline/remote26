import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
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
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Updated method — name: ${data.methodName || '—'}, url: ${data.url || '—'}, username: ${data.username || '—'}, password: ${data.password || '—'}, notes: ${data.notes || '—'}`,
            timestamp: new Date(),
          },
        ],
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

export async function DELETE(_req: NextRequest, { params }: CustomerAllProps) {
  try {
    const { customerId, methodId } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const deleted = customer.methodInfo.find(m => m.id === methodId)

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        methodInfo: customer.methodInfo.filter(m => m.id !== methodId),
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Deleted method — name: ${deleted?.methodName || '—'}, url: ${deleted?.url || '—'}, username: ${deleted?.username || '—'}, password: ${deleted?.password || '—'}, notes: ${deleted?.notes || '—'}`,
            timestamp: new Date(),
          },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}