import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps, DevicePasswordSchema } from '@/app/schema';
import { z } from 'zod';

export async function POST(req: NextRequest, { params }: CustomerAllProps) {
  try {
    const body = await req.json();
    const { customerId } = await params

    const data = DevicePasswordSchema.parse(body);

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const newDevice = {
      id: new ObjectId().toString(),
      make: data.make ?? '',
      username: data.username ?? '',
      password: data.password ?? '',
    }

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        devicePassword: [...customer.devicePassword, newDevice],
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Added device — make: ${newDevice.make || '—'}, username: ${newDevice.username || '—'}, password: ${newDevice.password || '—'}`,
            timestamp: new Date(),
          },
        ],
      },
    })

    return NextResponse.json(newDevice, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: z.flattenError(error), message: 'Validation failed' },
        { status: 400 }
      );
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to add device' }, { status: 500 });
  }
}
