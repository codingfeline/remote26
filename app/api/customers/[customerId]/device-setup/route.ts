import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps, DeviceSetupSchema } from '@/app/schema';
import { z } from 'zod';

export async function POST(req: NextRequest, { params }: CustomerAllProps) {
  try {
    const body = await req.json();
    const { customerId } = await params

    const data = DeviceSetupSchema.parse(body);

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const newEntry = {
      id: new ObjectId().toString(),
      comment: data.comment ?? '',
      screenshot: data.screenshot ?? '',
      path: data.path ?? '',
    }

    await prisma.customer.update({
      where: { id: customerId },
      data: { deviceSetup: [...customer.deviceSetup, newEntry] },
    })

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: z.flattenError(error), message: 'Validation failed' },
        { status: 400 }
      );
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to add device setup' }, { status: 500 });
  }
}
