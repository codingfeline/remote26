import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps } from '@/app/schema';

export async function POST(_req: NextRequest, { params }: CustomerAllProps) {
  try {
    const { customerId, steid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const restored = customer.scanToEmail.find(e => e.id === steid)
    if (!restored) {
      return NextResponse.json({ error: 'Scan to email not found' }, { status: 404 });
    }

    const updated = customer.scanToEmail.map(e =>
      e.id === steid ? { ...e, archivedAt: null } : e,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        scanToEmail: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Restored scan to email — hostname: ${restored.hostname || '—'}, username: ${restored.username || '—'}, password: ${restored.password || '—'}, port: ${restored.port || '—'}`,
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
