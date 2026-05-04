import { NextRequest, NextResponse, ObjectId, prisma } from '@/app/api';
import { CustomerAllProps, ScanToEmailSchema } from '@/app/schema';
import { z } from 'zod';

export async function POST(req: NextRequest, { params }: CustomerAllProps) {
  try {
    const body = await req.json();
    const { customerId } = await params

    const data = ScanToEmailSchema.parse(body);

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const newEntry = {
      id: new ObjectId().toString(),
      hostname: data.hostname ?? '',
      username: data.username ?? '',
      password: data.password ?? '',
      port: data.port ?? '',
    }

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        scanToEmail: [...customer.scanToEmail, newEntry],
        logs: [
          ...(customer.logs ?? []),
          {
            id: new ObjectId().toString(),
            message: `Added scan to email — hostname: ${newEntry.hostname || '—'}, username: ${newEntry.username || '—'}, password: ${newEntry.password || '—'}, port: ${newEntry.port || '—'}`,
            timestamp: new Date(),
          },
        ],
      },
    })

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: z.flattenError(error), message: 'Validation failed' },
        { status: 400 }
      );
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to add scan-to-email' }, { status: 500 });
  }
}
