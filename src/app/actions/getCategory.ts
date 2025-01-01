"use server";
import { db } from "@/db/db";
import { categories, users } from "@/db/schema";
import { authOptions } from "@/app/utils/authOptions";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export type CategoryResult = { id: string; name: string; userId: string; type: string }[] | { error: string };

const getCategoriesByType = async (userId: string, type: string): Promise<{ id: string; name: string; userId: string; type: string }[]> => {
    return await db.select().from(categories).where(and(eq(categories.userId, userId), eq(categories.type, type)));
};

export type CategoriesResult =
    | { error: string }
    | {
        incomeCategories: Array<{ id: string; name: string; userId: string; type: string }>;
        expenseCategories: Array<{ id: string; name: string; userId: string; type: string }>;
        allCategories: Array<{ id: string; name: string; userId: string; type: string }>;
    };

const getCategories = async (): Promise<CategoriesResult> => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: "Unauthorized" };
        }

        const userId = session.user?.id;
        if (!userId) {
            return { error: "User ID not found" };
        }

        // Check if the user exists
        const userExists = await db.select().from(users).where(eq(users.id, userId)).execute();
        if (userExists.length === 0) {
            return { error: "User not found" };
        }

        // Fetch or seed income categories
        let incomeCategories = await getCategoriesByType(userId, 'income');
        if (incomeCategories.length === 0) {
            await seedCategories(userId, 'income');
            incomeCategories = await getCategoriesByType(userId, 'income');
        }

        // Fetch or seed expense categories
        let expenseCategories = await getCategoriesByType(userId, 'expense');
        if (expenseCategories.length === 0) {
            await seedCategories(userId, 'expense');
            expenseCategories = await getCategoriesByType(userId, 'expense');
        }

        return {
            incomeCategories,
            expenseCategories,
            allCategories: [...incomeCategories, ...expenseCategories],
        };
    } catch (error) {
        throw new Error(String(error));
    }
};

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
    try {
        // Check if the user exists
        const userExists = await db.select().from(users).where(eq(users.id, userId)).execute();
        if (userExists.length === 0) {
            return;
        }

        // Check if categories already exist for this user and type
        const existingCategories = await db.select().from(categories).where(and(eq(categories.userId, userId), eq(categories.type, type))).execute();
        if (existingCategories.length > 0) {
            return;
        }

        // Prepare categories for insertion
        const predefinedCategories = type === 'income' ? predefinedIncomeCategories : predefinedExpenseCategories;
        const categoriesToInsert = predefinedCategories.map(category => ({
            id: nanoid(),
            name: category.name,
            userId: userId,
            type: type,
        }));

        // Insert categories in a batch
        await db.insert(categories).values(categoriesToInsert).execute();
    } catch (error) {
        throw new Error(String(error));
    }
}