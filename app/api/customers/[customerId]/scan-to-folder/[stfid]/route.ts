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

    const updated = customer.scanToFolder.map(entry => {
      if (entry.id === stfid) return { ...entry, ...data }
      return entry
    })

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        scanToFolder: updated,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Updated scan to folder — hostname: ${data.hostname || '—'}, folder: ${data.folder || '—'}, username: ${data.username || '—'}, password: ${data.password || '—'}`,
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
    const { customerId, stfid } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const deleted = customer.scanToFolder.find(e => e.id === stfid)

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        scanToFolder: customer.scanToFolder.filter(e => e.id !== stfid),
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Deleted scan to folder — hostname: ${deleted?.hostname || '—'}, folder: ${deleted?.folder || '—'}, username: ${deleted?.username || '—'}, password: ${deleted?.password || '—'}`,
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
