// app/api/notes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { notes } from '@/db/schema'; // Import your schema
import { eq } from 'drizzle-orm';
import { db } from '@/db/db';

export async function PATCH(request: NextRequest) {
  const { title, content, color, category, tags, id } = await request.json();

  try {
    const updatedNote = await db.update(notes).set({
      title,
      content,
      color,
      category,
      tags: tags.join(','),
      updatedAt: new Date().toISOString(),
    }).where(eq(notes.id, id)).returning();

    if (updatedNote.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json(updatedNote[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update note' + error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  try {
    const deletedNote = await db.delete(notes).where(eq(notes.id, id)).returning();
    if (deletedNote.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json(deletedNote[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete note' + error }, { status: 500 });
  }
}