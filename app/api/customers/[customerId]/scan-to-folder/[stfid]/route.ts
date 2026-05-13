import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps, ScanToFolderSchema } from '@/app/schema';
import { z } from 'zod';

export async function PATCH(req: NextRequest, { params }: CustomerAllProps) {
  try {
    const body = await req.json();
    const data = ScanToFolderSchema.parse(body);

    const { customerId, stfid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const existing = customer.scanToFolder.find(e => e.id === stfid)
    const updated = customer.scanToFolder.map(entry => {
      if (entry.id === stfid) return { ...entry, ...data }
      return entry
    })

    const changes = (['hostname', 'folder', 'username', 'password'] as const)
      .filter(k => (existing?.[k] ?? '') !== (data[k] ?? ''))
      .map(k => `${k}: ${existing?.[k] || '—'} → ${data[k] || '—'}`)

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        scanToFolder: updated,
        logs: changes.length
          ? [
              ...(customer.logs ?? []),
              {
                id: new ObjectId().toString(),
                message: `Updated scan to folder — ${changes.join(', ')}`,
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
    const { customerId, stfid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const archived = customer.scanToFolder.find(e => e.id === stfid)
    if (!archived) {
      return NextResponse.json({ error: 'Scan to folder not found' }, { status: 404 });
    }

    const updated = customer.scanToFolder.map(e =>
      e.id === stfid ? { ...e, archivedAt: new Date() } : e,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        scanToFolder: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Archived scan to folder — hostname: ${archived.hostname || '—'}, folder: ${archived.folder || '—'}, username: ${archived.username || '—'}, password: ${archived.password || '—'}`,
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
