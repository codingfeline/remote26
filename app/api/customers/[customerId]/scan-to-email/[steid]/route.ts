import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps, ScanToEmailSchema } from '@/app/schema';
import { z } from 'zod';

export async function PATCH(req: NextRequest, { params }: CustomerAllProps) {
  try {
    const body = await req.json();
    const data = ScanToEmailSchema.parse(body);

    const { customerId, steid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const updated = customer.scanToEmail.map(entry => {
      if (entry.id === steid) return { ...entry, ...data }
      return entry
    })

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        scanToEmail: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Updated scan to email — hostname: ${data.hostname || '—'}, username: ${data.username || '—'}, password: ${data.password || '—'}, port: ${data.port || '—'}`,
            timestamp: new Date(),
          },
        ],
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
    const { customerId, steid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const deleted = customer.scanToEmail.find(e => e.id === steid)

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        scanToEmail: customer.scanToEmail.filter(e => e.id !== steid),
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Deleted scan to email — hostname: ${deleted?.hostname || '—'}, username: ${deleted?.username || '—'}, password: ${deleted?.password || '—'}, port: ${deleted?.port || '—'}`,
            timestamp: new Date(),
          },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
