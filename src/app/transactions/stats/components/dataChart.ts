type Transaction = {
    id: string
    type: string
    date: string
    account: string
    amount: number
    category: string
    note: string
    description: string
    bookmarked: string
    userId: string
    createdAt: string
    updatedAt: string
  }
  
  // Dummy transactions data matching the pie chart percentages
 export const transactions: Transaction[] = [
      // {
      //   id: '1',
      //   type: 'expense',
      //   date: '2024-01-01',
      //   account: 'Main Account',
      //   amount: 4880,
      //   category: 'Other',
      //   note: 'Miscellaneous expenses',
      //   description: 'Various other expenses',
      //   bookmarked: 'false',
      //   userId: 'user1',
      //   createdAt: '2024-01-01T00:00:00Z',
      //   updatedAt: '2024-01-01T00:00:00Z'
      // },
      // {
      //   id: '2',
      //   type: 'expense',
      //   date: '2024-01-02',
      //   account: 'Main Account',
      //   amount: 3710,
      //   category: 'Hostel Rent',
      //   note: 'Monthly rent',
      //   description: 'January rent payment',
      //   bookmarked: 'false',
      //   userId: 'user1',
      //   createdAt: '2024-01-02T00:00:00Z',
      //   updatedAt: '2024-01-02T00:00:00Z'
      // },
      // {
      //   id: '3',
      //   type: 'expense',
      //   date: '2024-01-03',
      //   account: 'Main Account',
      //   amount: 500,
      //   category: 'D-Mart',
      //   note: 'Groceries',
      //   description: 'Monthly groceries',
      //   bookmarked: 'false',
      //   userId: 'user1',
      //   createdAt: '2024-01-03T00:00:00Z',
      //   updatedAt: '2024-01-03T00:00:00Z'
      // },
      // {
      //   id: '4',
      //   type: 'expense',
      //   date: '2024-01-04',
      //   account: 'Main Account',
      //   amount: 450,
      //   category: 'Food',
      //   note: 'Food expenses',
      //   description: 'Restaurant and delivery',
      //   bookmarked: 'false',
      //   userId: 'user1',
      //   createdAt: '2024-01-04T00:00:00Z',
      //   updatedAt: '2024-01-04T00:00:00Z'
      // },
      // {
      //   id: '5',
      //   type: 'expense',
      //   date: '2024-01-05',
      //   account: 'Main Account',
      //   amount: 190,
      //   category: 'Health',
      //   note: 'Medical expenses',
      //   description: 'Medicine and consultation',
      //   bookmarked: 'false',
      //   userId: 'user1',
      //   createdAt: '2024-01-05T00:00:00Z',
      //   updatedAt: '2024-01-05T00:00:00Z'
      // },
      // {
      //   id: '6',
      //   type: 'expense',
      //   date: '2024-01-06',
      //   account: 'Main Account',
      //   amount: 140,
      //   category: 'Recharge',
      //   note: 'Mobile recharge',
      //   description: 'Monthly phone plan',
      //   bookmarked: 'false',
      //   userId: 'user1',
      //   createdAt: '2024-01-06T00:00:00Z',
      //   updatedAt: '2024-01-06T00:00:00Z'
      // },
      // {
      //   id: '7',
      //   type: 'expense',
      //   date: '2024-01-07',
      //   account: 'Main Account',
      //   amount: 110,
      //   category: 'Transport',
      //   note: 'Travel expenses',
      //   description: 'Bus and auto fares',
      //   bookmarked: 'false',
      //   userId: 'user1',
      //   createdAt: '2024-01-07T00:00:00Z',
      //   updatedAt: '2024-01-07T00:00:00Z'
      // },
      // {
      //   id: '8',
      //   type: 'expense',
      //   date: '2024-01-08',
      //   account: 'Main Account',
      //   amount: 20,
      //   category: 'Chai',
      //   note: 'Tea expenses',
      //   description: 'Daily tea',
      //   bookmarked: 'false',
      //   userId: 'user1',
      //   createdAt: '2024-01-08T00:00:00Z',
      //   updatedAt: '2024-01-08T00:00:00Z'
      // },
      {
        id: '9',
        type: 'expense',
        date: '2024-01-01',
        account: 'Main Account',
        amount: 4880,
        category: 'Other',
        note: 'Miscellaneous expenses',
        description: 'Various other expenses',
        bookmarked: 'false',
        userId: 'user1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '10',
        type: 'expense',
        date: '2024-01-02',
        account: 'Main Account',
        amount: 3710,
        category: 'Hostel Rent',
        note: 'Monthly rent',
        description: 'January rent payment',
        bookmarked: 'false',
        userId: 'user1',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      },
      {
        id: '11',
        type: 'expense',
        date: '2024-01-03',
        account: 'Main Account',
        amount: 500,
        category: 'D-Mart',
        note: 'Groceries',
        description: 'Monthly groceries',
        bookmarked: 'false',
        userId: 'user1',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z'
      },
      {
        id: '12',
        type: 'expense',
        date: '2024-01-04',
        account: 'Main Account',
        amount: 450,
        category: 'Food',
        note: 'Food expenses',
        description: 'Restaurant and delivery',
        bookmarked: 'false',
        userId: 'user1',
        createdAt: '2024-01-04T00:00:00Z',
        updatedAt: '2024-01-04T00:00:00Z'
      },
      {
        id: '13',
        type: 'expense',
        date: '2024-01-05',
        account: 'Main Account',
        amount: 190,
        category: 'Health',
        note: 'Medical expenses',
        description: 'Medicine and consultation',
        bookmarked: 'false',
        userId: 'user1',
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z'
      },
      {
        id: '14',
        type: 'expense',
        date: '2024-01-06',
        account: 'Main Account',
        amount: 140,
        category: 'Recharge',
        note: 'Mobile recharge',
        description: 'Monthly phone plan',
        bookmarked: 'false',
        userId: 'user1',
        createdAt: '2024-01-06T00:00:00Z',
        updatedAt: '2024-01-06T00:00:00Z'
      },
      {
        id: '15',
        type: 'expense',
        date: '2024-01-07',
        account: 'Main Account',
        amount: 110,
        category: 'Transport',
        note: 'Travel expenses',
        description: 'Bus and auto fares',
        bookmarked: 'false',
        userId: 'user1',
        createdAt: '2024-01-07T00:00:00Z',
        updatedAt: '2024-01-07T00:00:00Z'
      },
      {
        id: '16',
        type: 'expense',
        date: '2024-01-08',
        account: 'Main Account',
        amount: 20,
        category: 'Chai',
        note: 'Tea expenses',
        description: 'Daily tea',
        bookmarked: 'false',
        userId: 'user1',
        createdAt: '2024-01-08T00:00:00Z',
        updatedAt: '2024-01-08T00:00:00Z'
      }
    ]