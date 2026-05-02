import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps, ServerSchema } from '@/app/schema';
import { z } from 'zod';

export async function POST(req: NextRequest, { params }: CustomerAllProps
) {
  try {
    const body = await req.json();
    const { customerId } = await params
    // validate request body
    const data = ServerSchema.parse(body);

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // create new method info
    const newServerInfo = {
      id: new ObjectId().toString(),
      name: data.name ?? "",
      ip: data.ip ?? "",
      username: data.username ?? "",
      password: data.password ?? "",
    }

    // add new method info to existing list
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        server: [
          ...customer.server,
          newServerInfo,
        ]
      }
    })
    return NextResponse.json(newServerInfo, { status: 201 });

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