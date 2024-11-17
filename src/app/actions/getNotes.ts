"use server";

import { auth } from "@/auth";
import { db } from "@/db/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  const session = await auth()
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

    // Convert tags from comma-separated string to array of strings
    // Convert liked and pinned from string to boolean
    const Notes: Notes[] = dbNotes.map(note => ({
      ...note,
      tags: note.tags.split(',').map(tag => tag.trim()),
      liked: note.liked === 'true',
      pinned: note.pinned === 'true',
    }));

    return { Notes };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }
}