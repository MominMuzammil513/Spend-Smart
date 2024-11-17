"use server"

import { auth } from "@/auth";
import { db } from "@/db/db";
import { accountTypes, users } from "@/db/schema";

import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
// Account type functions are now separated
// types/account.ts

export type AccountType = {
    id: string;
    name: string;
    userId: string;
};

export type GetAccountTypesResult = AccountType[] | { error: string };

const predefinedAccountTypes = [
    { name: 'Card 💳' },
    { name: 'UPI 💻' },
    { name: 'Cash 💸' },
    { name: 'Bank Account 🏦' },
    { name: 'Digital Wallet 📈' },
    { name: 'Other 💡' },
    { name: 'Online Payment 💳' }
];

async function seedAccountType(userId: string) {
    // Check if the user exists
    const userExists = await db.select().from(users).where(eq(users.id, userId)).execute();
    if (userExists.length === 0) {
        throw new Error(`No user found with ID ${userId}, cannot seed account types.`);

    }
    for (const accountType of predefinedAccountTypes) {
        await db.insert(accountTypes).values({
            id: nanoid(),
            name: accountType.name,
            userId: userId,
        });
    }
}

const getAccountByType = async (userId: string): Promise<{ id: string; name: string; userId: string;}[]> => {
    return await db.select().from(accountTypes).where(and(eq(accountTypes.userId, userId)));
}

export const getAccountTypes = async () => {
    const session = await auth()
    if (!session) {
        return { error: "Unauthorized" };
    }

    const userId = session.user?.id;
    if (!userId) {
        return { error: "User ID not found" };
    }

    let accountTypeList = await getAccountByType(userId);

    if (accountTypeList.length === 0) {
        await seedAccountType(userId);
        accountTypeList = await getAccountByType(userId);
    }

    return accountTypeList
}