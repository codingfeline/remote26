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

    // save entire array
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        contact: updatedContact,
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Updated contact — name: ${data.name || '—'}, email: ${data.email || '—'}, tel: ${data.tel || '—'}`,
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
    const { customerId, contactId } = await params

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const deleted = customer.contact.find(c => c.id === contactId)

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        contact: customer.contact.filter(c => c.id !== contactId),
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Deleted contact — name: ${deleted?.name || '—'}, email: ${deleted?.email || '—'}, tel: ${deleted?.tel || '—'}`,
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