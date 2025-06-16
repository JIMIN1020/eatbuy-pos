import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './config';
import { getToday } from './date';

export interface SalesItem {
  name: string;
  option: string;
  quantity: number;
  amount: number;
}

export interface OrderItem {
  id: number;
  name: string;
  option: string;
  price: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  items: OrderItem[];
  totalAmount: number;
  timestamp: number;
}

export const saveSalesData = async (orderItems: OrderItem[]): Promise<void> => {
  if (orderItems.length === 0) return;

  const today = getToday();
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const transaction: Transaction = {
    id: '',
    date: today,
    time: time,
    items: [...orderItems],
    totalAmount: orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    timestamp: now.getTime(),
  };

  try {
    const transactionsRef = collection(db, 'transactions');
    await addDoc(transactionsRef, transaction);
  } catch (error) {
    console.error('거래 데이터 저장 중 오류:', error);
    throw error;
  }
};

export const getSalesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Record<string, Record<string, SalesItem>>> => {
  const results: Record<string, Record<string, SalesItem>> = {};

  try {
    const salesCollection = collection(db, 'sales');
    const salesQuery = query(
      salesCollection,
      where('__name__', '>=', startDate),
      where('__name__', '<=', endDate)
    );

    const salesSnapshot = await getDocs(salesQuery);
    salesSnapshot.forEach((doc) => {
      results[doc.id] = doc.data() as Record<string, SalesItem>;
    });

    const transactionsCollection = collection(db, 'transactions');
    const transactionsQuery = query(
      transactionsCollection,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );

    const transactionsSnapshot = await getDocs(transactionsQuery);

    transactionsSnapshot.forEach((doc) => {
      const transaction = doc.data() as Transaction;
      transaction.id = doc.id;
      const date = transaction.date;

      if (results[date] && date === '2025-06-16') {
        return;
      }

      if (!results[date]) {
        results[date] = {};
      }

      transaction.items.forEach((item) => {
        const key = item.id.toString();
        if (!results[date][key]) {
          results[date][key] = {
            name: item.name,
            option: item.option,
            quantity: 0,
            amount: 0,
          };
        }

        results[date][key].quantity += item.quantity;
        results[date][key].amount += item.price * item.quantity;
      });
    });

    return results;
  } catch (error) {
    console.error('데이터 조회 중 오류:', error);
    throw error;
  }
};

export const getTransactionsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Transaction[]> => {
  const transactionsCollection = collection(db, 'transactions');
  const results: Transaction[] = [];

  const q = query(
    transactionsCollection,
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data() as Transaction;
    data.id = doc.id;
    results.push(data);
  });

  return results.sort((a, b) => b.timestamp - a.timestamp);
};

export const deleteTransaction = async (
  transactionId: string
): Promise<void> => {
  const transactionRef = doc(db, 'transactions', transactionId);
  await deleteDoc(transactionRef);
};
