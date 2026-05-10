import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps, ServerSchema } from '@/app/schema';
import { z } from 'zod';

export async function PATCH(req: NextRequest, { params }: CustomerAllProps) {
  try {
    const body = await req.json();

    // validate input
    const data = ServerSchema.parse(body);

    const { customerId, sid } = await params

    // get existing customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const existing = customer.server.find(s => s.id === sid)

    // update method info
    const updatedServer = customer.server.map((server) => {
      if (server.id === sid) {
        return {
          ...server,
          ...data,
        };
      }
      return server;
    })

    const changes = (['name', 'ip', 'username', 'password', 'notes'] as const)
      .filter(k => (existing?.[k] ?? '') !== (data[k] ?? ''))
      .map(k => `${k}: ${existing?.[k] || '—'} → ${data[k] || '—'}`)

    // save entire array
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        server: updatedServer,
        logs: changes.length
          ? [
              ...(customer.logs ?? []),
              {
                id: new ObjectId().toString(),
                message: `Updated server — ${changes.join(', ')}`,
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
    const { customerId, sid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    await prisma.customer.update({
      where: { id: customerId },
      data: { server: customer.server.filter(s => s.id !== sid) },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}