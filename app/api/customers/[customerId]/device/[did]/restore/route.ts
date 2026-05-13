import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps } from '@/app/schema';

export async function POST(_req: NextRequest, { params }: CustomerAllProps) {
  try {
    const { customerId, did } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const restored = customer.devicePassword.find(d => d.id === did)
    if (!restored) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    const updated = customer.devicePassword.map(d =>
      d.id === did ? { ...d, archivedAt: null } : d,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        devicePassword: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Restored device — make: ${restored.make || '—'}, username: ${restored.username || '—'}, password: ${restored.password || '—'}`,
            timestamp: new Date(),
          },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to restore' }, { status: 500 });
  }
}
