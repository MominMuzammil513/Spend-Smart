"use server";

import { db } from "@/db/db";
import { notes } from "@/db/schema";
import { authOptions } from "@/app/utils/authOptions";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export type Notes = {
  id: string;
  title: string;
  content: string;
  color: string;
  category: string;
  tags: string[];
  liked: boolean;
  pinned: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type NotesResult =
  | { error: string }
  | { Notes: Notes[] };

export async function getNotes(): Promise<NotesResult> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Unauthorized" };
  }

  const userId = session.user?.id;
  if (!userId) {
    return { error: "User ID not found" };
  }

  try {
    const dbNotes = await db
      .select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        color: notes.color,
        category: notes.category,
        tags: notes.tags,
        liked: notes.liked,
        pinned: notes.pinned,
        userId: notes.userId,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .where(eq(notes.userId, userId));

    const Notes: Notes[] = dbNotes.map(note => ({
      ...note,
      tags: note.tags.split(',').map(tag => tag.trim()),
      liked: note.liked === 'true',
      pinned: note.pinned === 'true',
    }));

    return { Notes };
  } catch (error) {
    throw new Error(String(error));
  }
}