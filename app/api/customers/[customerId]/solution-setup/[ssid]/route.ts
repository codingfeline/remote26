import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps, SolutionSchema } from '@/app/schema';
import { del } from '@vercel/blob';
import { z } from 'zod';

export async function PATCH(req: NextRequest, { params }: CustomerAllProps) {
  try {
    const body = await req.json();
    const data = SolutionSchema.parse(body);

    const { customerId, ssid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const existing = customer.solutionSetup.find(e => e.id === ssid)
    const updated = customer.solutionSetup.map(entry => {
      if (entry.id === ssid) return { ...entry, ...data }
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
        solutionSetup: updated,
        logs: changes.length
          ? [
              ...(customer.logs ?? []),
              {
                id: new ObjectId().toString(),
                message: `Updated solution setup — ${changes.join(', ')}`,
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
    const { customerId, ssid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const archived = customer.solutionSetup.find(e => e.id === ssid)
    if (!archived) {
      return NextResponse.json({ error: 'Solution setup not found' }, { status: 404 });
    }

    const updated = customer.solutionSetup.map(e =>
      e.id === ssid ? { ...e, archivedAt: new Date() } : e,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        solutionSetup: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Archived solution setup — comment: ${archived.comment || '—'}, screenshot: ${archived.screenshot || '—'}`,
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
