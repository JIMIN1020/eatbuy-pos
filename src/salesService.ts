import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from './config';
import { getToday } from './date';

interface SalesItem {
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

export const saveSalesData = async (orderItems: OrderItem[]): Promise<void> => {
  if (orderItems.length === 0) return;

  const today = getToday();
  const salesRef = doc(db, 'sales', today);

  const docSnap = await getDoc(salesRef);
  const existingSales: Record<string, SalesItem> = docSnap.exists()
    ? (docSnap.data() as Record<string, SalesItem>)
    : {};

  orderItems.forEach((item) => {
    const key = item.id.toString();
    if (!existingSales[key]) {
      existingSales[key] = {
        name: item.name,
        option: item.option,
        quantity: 0,
        amount: 0,
      };
    }
    existingSales[key].quantity += item.quantity;
    existingSales[key].amount += item.price * item.quantity;
  });

  if (docSnap.exists()) {
    await updateDoc(salesRef, existingSales);
  } else {
    await setDoc(salesRef, existingSales);
  }
};

export const getSalesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Record<string, Record<string, SalesItem>>> => {
  const salesCollection = collection(db, 'sales');
  const results: Record<string, Record<string, SalesItem>> = {};

  const q = query(
    salesCollection,
    where('__name__', '>=', startDate),
    where('__name__', '<=', endDate)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    results[doc.id] = doc.data() as Record<string, SalesItem>;
  });

  return results;
};
