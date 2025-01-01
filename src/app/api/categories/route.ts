import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';


const categorySchema = z.object({
  name: z.string().min(1, "Category name is required."),
  type: z.enum(['income', 'expense', 'transfer'])
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const parsed = categorySchema.parse(body);
    const newCategory = {
      id: crypto.randomUUID(),
      name: parsed.name,
      type: parsed.type,
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(categories).values(newCategory);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const DELETE = async (req: NextRequest) => {

  try {
    const { categoryId } = await req.json();

    // Ensure categoryId is a string
    if (!categoryId) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    // Delete the category by its ID
    await db.delete(categories).where(eq(categories.id, categoryId));

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
    const { categoryId,name } = await req.json();

    // Ensure categoryId is a string
    if (!categoryId || typeof categoryId !== 'string') {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    };

    // Update the category by its ID
    await db.update(categories).set({name}).where(eq(categories.id, categoryId));

    return NextResponse.json({ message: "Updated successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

{/**
  const deleteCategorySchema = z.object({
  categoryIds: z.array(z.string()).nonempty("At least one category ID is required.")
});

export const DELETE = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parsed = deleteCategorySchema.parse(body);

    // Delete each category by its ID
    for (const categoryId of parsed.categoryIds) {
      await db.delete(categories).where(eq(categories.id, categoryId));
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}; */}