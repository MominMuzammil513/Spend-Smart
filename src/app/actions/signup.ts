"use server";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { FormSchema } from "@/lib/ZodSchmas/signup-login";
export const SignupAction = async (formdata: z.infer<typeof FormSchema>) => {
  const validatedFields = FormSchema.safeParse(formdata);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { cpassword, email, password, username } = validatedFields.data;
  if (password !== cpassword)
    return { success: false, message: "paswords doesn't match" };
  const userCheker = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (userCheker)
    return {
      success: false,
      message: `user with email ${email} already exists.`,
    };
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
    if (user[0]) return { success: true };
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};
