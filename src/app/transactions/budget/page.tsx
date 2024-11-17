
import React from 'react'
import Budget from './components/TotalBuget';
import { getBudgets } from '@/app/actions/getBudgets';
import getCategories from '@/app/actions/getCategory';
import { getTransactions } from '@/app/actions/getTransactions';

const BudgetPage = async () => {
  const budget = await getBudgets()
  const categoriesResult = await getCategories();
  const transactionsResult = await getTransactions();

  if ('error' in transactionsResult) {
    return <div>Error: {transactionsResult.error}</div>;
  }
  if ('error' in budget) {
    return <div>Error: {budget.error}</div>;
  }
  if ('error' in categoriesResult) {
    return <div>Error: {categoriesResult.error}</div>;
  }
  return (
    <>
    <Budget transactions={transactionsResult.transactions} budgets={budget.Budgets} categories={categoriesResult.allCategories}/>
    </>
  )
}

export default BudgetPage