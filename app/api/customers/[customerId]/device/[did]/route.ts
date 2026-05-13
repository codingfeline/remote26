import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps, DevicePasswordSchema } from '@/app/schema';
import { z } from 'zod';

export async function PATCH(req: NextRequest, { params }: CustomerAllProps) {
  try {
    const body = await req.json();
    const data = DevicePasswordSchema.parse(body);

    const { customerId, did } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const existing = customer.devicePassword.find(d => d.id === did)
    const updatedDevices = customer.devicePassword.map(device => {
      if (device.id === did) return { ...device, ...data }
      return device
    })

    const changes = (['make', 'username', 'password'] as const)
      .filter(k => (existing?.[k] ?? '') !== (data[k] ?? ''))
      .map(k => `${k}: ${existing?.[k] || '—'} → ${data[k] || '—'}`)

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        devicePassword: updatedDevices,
        logs: changes.length
          ? [
              ...(customer.logs ?? []),
              {
                id: new ObjectId().toString(),
                message: `Updated device — ${changes.join(', ')}`,
                timestamp: new Date(),
              },
            ]
          : (customer.logs ?? []),
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
    const { customerId, did } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const archived = customer.devicePassword.find(d => d.id === did)
    if (!archived) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    const updated = customer.devicePassword.map(d =>
      d.id === did ? { ...d, archivedAt: new Date() } : d,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        devicePassword: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Archived device — make: ${archived.make || '—'}, username: ${archived.username || '—'}, password: ${archived.password || '—'}`,
            timestamp: new Date(),
          },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to archive' }, { status: 500 });
  }
}
