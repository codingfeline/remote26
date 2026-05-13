import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps } from '@/app/schema';

export async function POST(_req: NextRequest, { params }: CustomerAllProps) {
  try {
    const { customerId, stfid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const restored = customer.scanToFolder.find(e => e.id === stfid)
    if (!restored) {
      return NextResponse.json({ error: 'Scan to folder not found' }, { status: 404 });
    }

    const updated = customer.scanToFolder.map(e =>
      e.id === stfid ? { ...e, archivedAt: null } : e,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        scanToFolder: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Restored scan to folder — hostname: ${restored.hostname || '—'}, folder: ${restored.folder || '—'}, username: ${restored.username || '—'}, password: ${restored.password || '—'}`,
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
