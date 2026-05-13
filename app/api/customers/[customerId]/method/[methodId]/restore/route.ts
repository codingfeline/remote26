import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps } from '@/app/schema';

export async function POST(_req: NextRequest, { params }: CustomerAllProps) {
  try {
    const { customerId, methodId } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const restored = customer.methodInfo.find(m => m.id === methodId)
    if (!restored) {
      return NextResponse.json({ error: 'Method not found' }, { status: 404 });
    }

    const updated = customer.methodInfo.map(m =>
      m.id === methodId ? { ...m, archivedAt: null } : m,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        methodInfo: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Restored method — name: ${restored.methodName || '—'}, url: ${restored.url || '—'}, username: ${restored.username || '—'}, password: ${restored.password || '—'}, notes: ${restored.notes || '—'}`,
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
