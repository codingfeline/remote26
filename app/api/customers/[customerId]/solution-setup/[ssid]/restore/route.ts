import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps } from '@/app/schema';

export async function POST(_req: NextRequest, { params }: CustomerAllProps) {
  try {
    const { customerId, ssid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const restored = customer.solutionSetup.find(e => e.id === ssid)
    if (!restored) {
      return NextResponse.json({ error: 'Solution setup not found' }, { status: 404 });
    }

    const updated = customer.solutionSetup.map(e =>
      e.id === ssid ? { ...e, archivedAt: null } : e,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        solutionSetup: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Restored solution setup — comment: ${restored.comment || '—'}, screenshot: ${restored.screenshot || '—'}`,
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
