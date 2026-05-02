import { NextRequest, NextResponse, prisma } from '@/app/api';
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
      data: { scanToEmail: updated },
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

    await prisma.customer.update({
      where: { id: customerId },
      data: { scanToEmail: customer.scanToEmail.filter(e => e.id !== steid) },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
