import { useEffect } from 'react';
import { ensureSalesDataExists } from '../firebase/salesService';
import { useLocation } from 'react-router';

// sales 데이터를 저장하는 훅
export const useSaveData = () => {
  const pathname = useLocation().pathname;

  useEffect(() => {
    const initializeSalesData = async () => {
      try {
        await ensureSalesDataExists();
      } catch (error) {
        console.error('sales 데이터 초기화 중 오류:', error);
      }
    };

    initializeSalesData();
  }, [pathname]);
};
