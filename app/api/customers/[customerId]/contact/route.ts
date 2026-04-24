import { NextRequest, NextResponse, ObjectId, prisma, z } from '@/app/api';
import { ContactInfoSchema, CustomerAllProps } from '@/app/schema';

export async function POST(req: NextRequest, { params }: CustomerAllProps
) {
  try {
    const body = await req.json();
    const { customerId } = await params
    // validate request body
    const data = ContactInfoSchema.parse(body);

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // create new method info
    const newContactInfo = {
      id: new ObjectId().toString(),
      name: data.name ?? "",
      email: data.email ?? "",
      tel: data.tel ?? "",
    }

    // add new method info to existing list
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        contact: [
          ...customer.contact,
          newContactInfo,
        ]
      }
    })
    return NextResponse.json(newContactInfo, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: z.flattenError(error), message: 'Validation failed' },
        { status: 400 }
      );
    }
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to add method' },
      { status: 500 }
    );
  }
}