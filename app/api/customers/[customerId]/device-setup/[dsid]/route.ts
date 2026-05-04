import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps, DeviceSetupSchema } from '@/app/schema';
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

    const updated = customer.deviceSetup.map(entry => {
      if (entry.id === dsid) return { ...entry, ...data }
      return entry
    })

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        deviceSetup: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Updated device setup — comment: ${data.comment || '—'}, screenshot: ${data.screenshot || '—'}, path: ${data.path || '—'}`,
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
    const { customerId, dsid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const deleted = customer.deviceSetup.find(e => e.id === dsid)

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        deviceSetup: customer.deviceSetup.filter(e => e.id !== dsid),
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Deleted device setup — comment: ${deleted?.comment || '—'}, screenshot: ${deleted?.screenshot || '—'}, path: ${deleted?.path || '—'}`,
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
