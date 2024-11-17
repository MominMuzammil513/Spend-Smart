
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { cpassword, email, password, username } = body;
  if (password !== cpassword)
    return NextResponse.json(
      { success: false, message: "paswords doesn't match" },
      { status: 409 }
    );
  const userCheker = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (userCheker)
    return NextResponse.json(
      { success: false, message: `user with email ${email} already exists.` },
      { status: 404 }
    );
  const hashedPass = await bcrypt.hash(password, 10);
  try {
    const user = await db
      .insert(users)
      .values([
        {
          email,
          password: hashedPass,
          username,
          id: nanoid(10),
        },
      ])
      .returning();
    if (user[0]) return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 503 });
  }
  // return NextResponse.json(true,{status:200})
};
