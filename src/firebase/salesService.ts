import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from './config';
import { getToday } from '../utils/date';

/** ----- 개별 결제 건 저장 핸들러 ----- */
export const saveSalesData = async (
  orderItems: ReadyToOrderItem[]
): Promise<void> => {
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

/** ----- 날짜별 매출 조회 핸들러 ----- */
export const getSalesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Record<string, Record<string, SalesItem>>> => {
  const results: Record<string, Record<string, SalesItem>> = {};
  const today = getToday();

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

    const isTodayInRange = startDate <= today && today <= endDate;

    // 오늘 날짜의 데이터는 transactions에서 가져와서 계산
    if (isTodayInRange) {
      const transactionsCollection = collection(db, 'transactions');
      const transactionsQuery = query(
        transactionsCollection,
        where('date', '==', today)
      );

      const transactionsSnapshot = await getDocs(transactionsQuery);

      if (!results[today]) {
        results[today] = {};
      }

      transactionsSnapshot.forEach((doc) => {
        const transaction = doc.data() as Transaction;
        transaction.id = doc.id;

        transaction.items.forEach((item) => {
          const key = item.id.toString();
          if (!results[today][key]) {
            results[today][key] = {
              name: item.name,
              option: item.option,
              quantity: 0,
              amount: 0,
            };
          }

          results[today][key].quantity += item.quantity;
          results[today][key].amount += item.price * item.quantity;
        });
      });
    }

    return results;
  } catch (error) {
    console.error('데이터 조회 중 오류:', error);
    throw error;
  }
};

/** ----- 날짜별 거래 내역 조회 핸들러 ----- */
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

/** ----- 거래 내역 삭제 핸들러 ----- */
export const deleteTransaction = async (
  transactionId: string
): Promise<void> => {
  const transactionRef = doc(db, 'transactions', transactionId);
  await deleteDoc(transactionRef);
};

/** ----- 모든 거래 내역 조회 핸들러 ----- */
export const getAllTransactions = async (): Promise<Transaction[]> => {
  const transactionsCollection = collection(db, 'transactions');
  const results: Transaction[] = [];

  const querySnapshot = await getDocs(transactionsCollection);
  querySnapshot.forEach((doc) => {
    const data = doc.data() as Transaction;
    data.id = doc.id;
    results.push(data);
  });

  return results.sort((a, b) => b.timestamp - a.timestamp);
};

/** ----- 모든 매출 데이터 조회 핸들러 ----- */
export const getAllSalesData = async (): Promise<SalesItem[]> => {
  const salesCollection = collection(db, 'sales');
  const querySnapshot = await getDocs(salesCollection);
  const allSalesItems: SalesItem[] = [];

  querySnapshot.forEach((doc) => {
    const salesData = doc.data() as Record<string, SalesItem>;
    Object.values(salesData).forEach((item) => {
      allSalesItems.push(item);
    });
  });

  return allSalesItems;
};

/** ----- 특정 날짜의 sales 데이터가 존재하는지 확인하는 핸들러 ----- */
export const checkSalesDataExists = async (date: string): Promise<boolean> => {
  try {
    const salesDoc = doc(db, 'sales', date);
    const salesSnapshot = await getDoc(salesDoc);
    return salesSnapshot.exists();
  } catch (error) {
    console.error('sales 데이터 확인 중 오류:', error);
    return false;
  }
};

/** ----- transactions에서 특정 날짜의 데이터를 계산해서 sales에 저장하는 핸들러 ----- */
export const calculateAndSaveSalesData = async (
  date: string
): Promise<void> => {
  try {
    const transactions = await getTransactionsByDateRange(date, date);

    if (transactions.length === 0) {
      // 해당 날짜에 거래가 없으면 빈 데이터 저장
      const salesDoc = doc(db, 'sales', date);
      await setDoc(salesDoc, {});
      return;
    }

    const salesData: Record<string, SalesItem> = {};

    transactions.forEach((transaction) => {
      transaction.items.forEach((item) => {
        const key = item.id.toString();
        if (!salesData[key]) {
          salesData[key] = {
            name: item.name,
            option: item.option,
            quantity: 0,
            amount: 0,
          };
        }

        salesData[key].quantity += item.quantity;
        salesData[key].amount += item.price * item.quantity;
      });
    });

    const salesDoc = doc(db, 'sales', date);
    await setDoc(salesDoc, salesData);
  } catch (error) {
    console.error('sales 데이터 계산 및 저장 중 오류:', error);
    throw error;
  }
};

/** ----- 오늘 이전의 모든 날짜에 대해 sales 데이터가 없으면 계산해서 저장하는 핸들러 ----- */
export const ensureSalesDataExists = async (): Promise<void> => {
  try {
    const today = getToday();
    const allTransactions = await getAllTransactions();

    // 거래가 있는 고유한 날짜들을 추출
    const uniqueDates = [...new Set(allTransactions.map((t) => t.date))];

    // 오늘 이전의 날짜들만 필터링
    const pastDates = uniqueDates.filter((date) => date < today);

    // 각 날짜에 대해 sales 데이터가 없으면 계산해서 저장
    for (const date of pastDates) {
      const exists = await checkSalesDataExists(date);
      if (!exists) {
        console.log(`${date} 날짜의 sales 데이터를 계산하여 저장합니다.`);
        await calculateAndSaveSalesData(date);
      }
    }
  } catch (error) {
    console.error('sales 데이터 확인 및 저장 중 오류:', error);
    throw error;
  }
};

/** ----- 모든 sales 데이터를 날짜별로 가져오는 핸들러 ----- */
export const getAllSalesDataByDate = async (): Promise<
  Record<string, Record<string, SalesItem>>
> => {
  const salesCollection = collection(db, 'sales');
  const querySnapshot = await getDocs(salesCollection);
  const salesByDate: Record<string, Record<string, SalesItem>> = {};

  querySnapshot.forEach((doc) => {
    const date = doc.id;
    const salesData = doc.data() as Record<string, SalesItem>;
    salesByDate[date] = salesData;
  });

  return salesByDate;
};
