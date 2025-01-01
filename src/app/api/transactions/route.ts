import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { transactions, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';

const getUserId = async() =>{
    const session = await getServerSession(authOptions)
    return session&&session.user.id
}

export async function POST(req: NextRequest) {
    const userId = await getUserId()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { type, date, amount,account, category, note, description } = await req.json();
    // console.log({ Type: type, Date: date, Amount: amount, Category: category, Note: note, Description: description }, "+++++++++++++++");
    if (!type || !date || !amount || !category || !account) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 402 });
    }

    // Validate if the category exists for the user
    const categoryExists = await db
        .select()
        .from(categories)
        .where(
            eq(categories.userId, userId) &&
            eq(categories.name, category) &&
            eq(categories.type, type)
        );

    if (categoryExists.length === 0) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 403 });
    }

    try {
        const newTransaction = {
            id: crypto.randomUUID(),
            type,
            date,
            amount: parseFloat(amount),
            account,
            category, // Use the category name directly
            note: note || '',
            description: description || '',
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await db.insert(transactions).values(newTransaction);
        return NextResponse.json(newTransaction, { status: 201 });
    } catch (error) {
        // console.error('Error inserting transaction:', error);
        return NextResponse.json({ error: 'Internal Server Error' + error }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const userId = await getUserId()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id, type, date, amount, account, category, note, description, bookmarked } = await req.json();

    if (!id || !type || !date || !amount || !category || !account || !bookmarked) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 402 });
    }

    try {
        const updatedTransaction = {
            type,
            date,
            amount: parseFloat(amount),
            account,
            category, // Use the category name directly
            note: note || '',
            description: description || '',
            bookmarked: bookmarked || false,
            updatedAt: new Date().toISOString(),
        };

        const result = await db
            .update(transactions)
            .set(updatedTransaction)
            .where(
                eq(transactions.id, id)
                // eq(transactions.userId, userId)
            );

        if (result.count === 0) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTransaction, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' + error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'the Transaction is not found' }, { status: 402 });
    }

    try {

        const result = await db
            .delete(transactions).where(
                eq(transactions.id, id)
            );

        if (result.count === 0) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json({message:"The Transaction successfully deleted"}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' + error }, { status: 500 });
    }
}