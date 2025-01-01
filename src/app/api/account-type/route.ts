import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db/db';
import { accountTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';

const accountTypeSchema = z.object({
  name: z.string().min(1, "account type name is required."),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const parsed = accountTypeSchema.parse(body);

    const newAccountType = {
      id: crypto.randomUUID(),
      name: parsed.name,
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(accountTypes).values(newAccountType);
    return NextResponse.json(newAccountType, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const DELETE = async (req: NextRequest) => {

  try {
    const { accountId } = await req.json();

    // Ensure accountId is a string
    if (!accountId) {
      return NextResponse.json({ error: 'Invalid account ID' }, { status: 400 });
    }

    // Delete the account by its ID
    await db.delete(accountTypes).where(eq(accountTypes.id, accountId));

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const { accountId,name } = await req.json();
    // Ensure accountId is a string
    if (!accountId || !name) {
      return NextResponse.json({ error: 'Invalid account ID Or Name is Empty' }, { status: 400 });
    };

    // Update the account by its ID
    await db.update(accountTypes).set({name}).where(eq(accountTypes.id, accountId));

    return NextResponse.json({ message: "Updated successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};