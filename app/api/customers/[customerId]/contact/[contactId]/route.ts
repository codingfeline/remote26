import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { ContactInfoSchema, CustomerAllProps } from '@/app/schema';
import { z } from 'zod';

export async function PATCH(req: NextRequest, { params }: CustomerAllProps) {
  try {
    const body = await req.json();

    // validate input
    const data = ContactInfoSchema.parse(body);

    const { customerId, contactId } = await params

    // get existing customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const existing = customer.contact.find(c => c.id === contactId)

    // update method info
    const updatedContact = customer.contact.map((contact) => {
      if (contact.id === contactId) {
        return {
          ...contact,
          ...data,
        };
      }
      return contact;
    })

    const changes = (['name', 'email', 'tel'] as const)
      .filter(k => (existing?.[k] ?? '') !== (data[k] ?? ''))
      .map(k => `${k}: ${existing?.[k] || '—'} → ${data[k] || '—'}`)

    // save entire array
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        contact: updatedContact,
        logs: changes.length
          ? [
              ...(customer.logs ?? []),
              {
                id: new ObjectId().toString(),
                message: `Updated contact — ${changes.join(', ')}`,
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
    const { customerId, contactId } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const archived = customer.contact.find(c => c.id === contactId)
    if (!archived) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const updatedContact = customer.contact.map(c =>
      c.id === contactId ? { ...c, archivedAt: new Date() } : c,
    )

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        contact: updatedContact,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Archived contact — name: ${archived.name || '—'}, email: ${archived.email || '—'}, tel: ${archived.tel || '—'}`,
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