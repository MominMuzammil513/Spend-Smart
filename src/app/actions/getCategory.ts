"use server"

import { auth } from "@/auth";
import { db } from "@/db/db";
import { categories, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export type CategoryResult = { id: string; name: string; userId: string; type: string }[] | { error: string; }

const getCategoriesByType = async (userId: string, type: string): Promise<{ id: string; name: string; userId: string; type: string }[]> => {
    return await db.select().from(categories).where(and(eq(categories.userId, userId), eq(categories.type, type)));
}

export type CategoriesResult =
    | { error: string }
    | {
        incomeCategories: Array<{ id: string; name: string; userId: string; type: string }>;
        expenseCategories: Array<{ id: string; name: string; userId: string; type: string }>;
        allCategories: Array<{ id: string; name: string; userId: string; type: string }>;
    }

const getCategories = async (): Promise<CategoriesResult> => {
        const session = await auth();
    if (!session) {
        return { error: "Unauthorized" };
    }

    const userId = session.user?.id;
    if (!userId) {
        return { error: "User ID not found" };
    }

    let incomeCategories = await getCategoriesByType(userId, 'income');
    let expenseCategories = await getCategoriesByType(userId, 'expense');

    if (incomeCategories.length === 0) {
        await seedCategories(userId, 'income');
        incomeCategories = await getCategoriesByType(userId, 'income');
    }

    if (expenseCategories.length === 0) {
        await seedCategories(userId, 'expense');
        expenseCategories = await getCategoriesByType(userId, 'expense');
    }

    return {
        incomeCategories,
        expenseCategories,
        allCategories: [...incomeCategories, ...expenseCategories],
    }
}

export default getCategories;

const predefinedIncomeCategories = [
    { name: 'Allowance 💰' },
    { name: 'Salary 💼' },
    { name: 'Petty Cash 💵' },
    { name: 'Bonus 🎉' },
    { name: 'Investment 📈' },
    { name: 'Freelance 🆓' },
    { name: 'Gifts 🎁' },
    { name: 'Rental Income 🏠' },
    { name: 'Other 🔄' },
];

const predefinedExpenseCategories = [
    { name: 'Food 🍔' },
    { name: 'Transportation 🚗' },
    { name: 'Health 🏥' },
    { name: 'Education 📚' },
    { name: 'Clothing & Needs 👕' },
    { name: 'Entertainment 🎭' },
    { name: 'Utilities 💡' },
    { name: 'Housing 🏘️' },
    { name: 'Debt Payments 💳' },
    { name: 'Savings 🏦' },
    { name: 'Personal Care 💆' },
    { name: 'Travel ✈️' },
    { name: 'Gifts & Donations 🎀' },
    { name: 'Miscellaneous 🛒' },
];

async function seedCategories(userId: string, type: string) {
    // Check if the user exists
    const userExists = await db.select().from(users).where(eq(users.id, userId)).execute();
    if (userExists.length === 0) {
        // console.error(`No user found with ID ${userId}, cannot seed categories.`);
        return; // Exit if no user found
    }

    const predefinedCategories = type === 'income' ? predefinedIncomeCategories : predefinedExpenseCategories;

    for (const category of predefinedCategories) {
        await db.insert(categories).values({
            id: nanoid(),
            name: category.name,
            userId: userId,
            type: type,
        });
    }

    // console.log(`${type} categories seeded successfully`);
}