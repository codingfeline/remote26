import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps } from '@/app/schema';

export async function POST(_req: NextRequest, { params }: CustomerAllProps) {
  try {
    const { customerId, sid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const restored = customer.server.find(s => s.id === sid)
    if (!restored) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    const updated = customer.server.map(s =>
      s.id === sid ? { ...s, archivedAt: null } : s,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        server: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Restored server — name: ${restored.name || '—'}, ip: ${restored.ip || '—'}, username: ${restored.username || '—'}, password: ${restored.password || '—'}, notes: ${restored.notes || '—'}`,
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
