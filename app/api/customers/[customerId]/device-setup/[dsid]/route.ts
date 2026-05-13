import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps, DeviceSetupSchema } from '@/app/schema';
import { del } from '@vercel/blob';
import { z } from 'zod';

export async function PATCH(req: NextRequest, { params }: CustomerAllProps) {
  try {
    const body = await req.json();
    const data = DeviceSetupSchema.parse(body);

    const { customerId, dsid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const existing = customer.deviceSetup.find(e => e.id === dsid)
    const updated = customer.deviceSetup.map(entry => {
      if (entry.id === dsid) return { ...entry, ...data }
      return entry
    })

    if (existing?.screenshot && existing.screenshot !== data.screenshot) {
      del(existing.screenshot).catch(err =>
        console.error('Failed to delete replaced screenshot:', err),
      )
    }

    const changes = (['comment', 'screenshot'] as const)
      .filter(k => (existing?.[k] ?? '') !== (data[k] ?? ''))
      .map(k => `${k}: ${existing?.[k] || '—'} → ${data[k] || '—'}`)

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        deviceSetup: updated,
        logs: changes.length
          ? [
              ...(customer.logs ?? []),
              {
                id: new ObjectId().toString(),
                message: `Updated device setup — ${changes.join(', ')}`,
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
    const { customerId, dsid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const archived = customer.deviceSetup.find(e => e.id === dsid)
    if (!archived) {
      return NextResponse.json({ error: 'Device setup not found' }, { status: 404 });
    }

    const updated = customer.deviceSetup.map(e =>
      e.id === dsid ? { ...e, archivedAt: new Date() } : e,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        deviceSetup: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Archived device setup — comment: ${archived.comment || '—'}, screenshot: ${archived.screenshot || '—'}`,
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
