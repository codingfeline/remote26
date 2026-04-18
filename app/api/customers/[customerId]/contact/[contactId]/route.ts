import { ContactInfoSchema, CustomerAllProps, NextRequest, NextResponse, prisma, z } from '@/app/api';


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