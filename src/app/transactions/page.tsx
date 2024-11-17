import React from 'react';
import { Inter } from 'next/font/google';
import { getTransactions } from '../actions/getTransactions';
import getCategories from '../actions/getCategory';
import { getAccountTypes } from '../actions/getAccountType';
import Transactions from '../components/Transactions';
import InitializeStore from '@/lib/store/InitializeStore';

const inter = Inter({ subsets: ['latin'] });

const HomePage = async () => {
    const transactionsResult = await getTransactions();
    const categoriesResult = await getCategories();
    const accountList = await getAccountTypes();

    // Check for errors in transactionsResult
    // if ('error' in transactionsResult) {
    //     return <div>Error: {transactionsResult.error}</div>;
    // }

    // Check for errors in categoriesResult
    // if ('error' in categoriesResult) {
    //     return <div>Error: {categoriesResult.error}</div>;
    // }

    // Check if categories data is missing
    // if (!('allCategories' in categoriesResult)) {
    //     return <div>Error: Categories data is missing</div>;
    // }

    // Check for errors in accountList
    // if ('error' in accountList) {
    //     return <div>Error: Account list data is missing</div>;
    // }

    return (
        <>
            <InitializeStore
                transactionsResult={transactionsResult}
                categoriesResult={categoriesResult}
                accountList={accountList}
            />
            <Transactions />
        </>
    );
}

export default HomePage;