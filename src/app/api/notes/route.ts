// app/api/notes/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { notes } from '@/db/schema';
import { noteSchema } from '@/lib/zod/zodSchemas';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';

const getUserId = async () => {
    const session = await getServerSession(authOptions);
    return session && session.user.id;
}

export async function POST(request: Request) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();

  try {
    const validatedData = noteSchema.parse(body);
      const newNote = await db.insert(notes).values({
        id:crypto.randomUUID(),
        title:validatedData.title,
        content:validatedData.content,
        color:validatedData.color,
        category:validatedData.category,
        tags: validatedData.tags.join(','), // Assuming tags are stored as a comma-separated string
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        liked: 'false', // Ensure this matches the schema default
        pinned: 'false', // Ensure this matches the schema default
      }).returning();
  
      return NextResponse.json(newNote[0]);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create note' + error }, { status: 500 });
    }
  }