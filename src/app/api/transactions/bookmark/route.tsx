import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { transactions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';

const getUserId = async () => {
    const session = await getServerSession(authOptions)
    return session && session.user.id;
}

export async function GET() {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const bookmarkedTransactions = await db
            .select()
            .from(transactions)
            .where(
                eq(transactions.userId, userId) &&
                eq(transactions.bookmarked, 'true')
            );

        return NextResponse.json(bookmarkedTransactions, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' + error }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 402 });
    }

    try {
        // Fetch the current transaction to check its bookmark status
        const currentTransaction = await db
            .select()
            .from(transactions)
            .where(
                eq(transactions.id, id) &&
                eq(transactions.userId, userId)
            );

        if (currentTransaction.length === 0) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // Toggle the bookmark status
        const newBookmarkStatus = currentTransaction[0].bookmarked === 'true' ? 'false' : 'true';

        const result = await db
            .update(transactions)
            .set({ bookmarked: newBookmarkStatus, updatedAt: new Date().toISOString() })
            .where(
                eq(transactions.id, id) &&
                eq(transactions.userId, userId)
            );

        if (result.count === 0) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json({ bookmarked: newBookmarkStatus }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' + error }, { status: 500 });
    }
}