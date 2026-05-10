import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustIDProp, CustomerSchema } from '@/app/schema';
import { z } from 'zod';

export async function PATCH(req: NextRequest, { params }: CustIDProp) {
  try {
    const body = await req.json();
    const data = CustomerSchema.parse(body);
    const { customerId } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const changes = (['name', 'solution'] as const)
      .filter(k => (customer[k] ?? '') !== (data[k] ?? ''))
      .map(k => `${k}: ${customer[k] || '—'} → ${data[k] || '—'}`)

    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: data.name,
        solution: data.solution,
        logs: changes.length
          ? [
              ...(customer.logs ?? []),
              {
                id: new ObjectId().toString(),
                message: `Updated customer — ${changes.join(', ')}`,
                timestamp: new Date(),
              },
            ]
          : (customer.logs ?? []),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: z.flattenError(error) }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
