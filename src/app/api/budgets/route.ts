import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { budgets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';

const getUserId = async () => {
    const session = await getServerSession(authOptions);
    return session && session.user.id;
}

export async function POST(req: NextRequest) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { category, amount } = await req.json();
    if (!category || !amount) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 402 });
    }

    try {
        const newBudget = {
            id: crypto.randomUUID(),
            category,
            amount: parseFloat(amount),
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await db.insert(budgets).values(newBudget);
        return NextResponse.json(newBudget, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error'+ error }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id, category, amount } = await req.json();

    if (!id || !category || !amount) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 402 });
    }

    try {
        const updatedBudget = {
            category,
            amount: parseFloat(amount),
            updatedAt: new Date().toISOString(),
        };

        const result = await db
            .update(budgets)
            .set(updatedBudget)
            .where(
                eq(budgets.id, id) &&
                eq(budgets.userId, userId)
            );

        if (result.count === 0) {
            return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
        }

        return NextResponse.json(updatedBudget, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' + error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'Budget not found' }, { status: 402 });
    }

    try {
        const result = await db
            .delete(budgets)
            .where(
                eq(budgets.id, id)
            );

        if (result.count === 0) {
            return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
        }

        return NextResponse.json({ message: "Budget successfully deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' + error }, { status: 500 });
    }
}