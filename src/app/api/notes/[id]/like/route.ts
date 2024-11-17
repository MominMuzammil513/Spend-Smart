// app/api/notes/[id]/like/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { notes } from '@/db/schema'; // Import your schema
import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { auth } from '@/auth';

const getUserId = async () => {
  const session = await auth()
  return session && session.user.id;
}

export async function PATCH(
  request: NextRequest,
) {
  const { id } = await request.json();
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const note = await db.select().from(notes).where(eq(notes.id, id)).limit(1);

    if (note.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const updatedNote = await db.update(notes).set({
      liked: note[0].liked === 'true' ? 'false' : 'true',
      updatedAt: new Date().toISOString(),
    }).where(eq(notes.id, id)).returning();

    return NextResponse.json(updatedNote[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update note'+error }, { status: 500 });
  }
}