import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps } from '@/app/schema';

export async function POST(_req: NextRequest, { params }: CustomerAllProps) {
  try {
    const { customerId, contactId } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const restored = customer.contact.find(c => c.id === contactId)
    if (!restored) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const updatedContact = customer.contact.map(c =>
      c.id === contactId ? { ...c, archivedAt: null } : c,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        contact: updatedContact,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Restored contact — name: ${restored.name || '—'}, email: ${restored.email || '—'}, tel: ${restored.tel || '—'}`,
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
