import { useCallback, useEffect, useState } from "react";

export type DownlineHistoryItem = {
  id: string;
  date: string;
  productId: string;
  productName: string;
  customerIdentityNumber: string;
  customerName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  customerAddress: string;
  commissionAmount: number;
};

const KEY = "agenin_downline_history";

function readStorage(): DownlineHistoryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DownlineHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(data: DownlineHistoryItem[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function useDownlineHistory() {
  const [items, setItems] = useState<DownlineHistoryItem[]>([]);

  useEffect(() => {
    setItems(readStorage());
  }, []);

  const addItem = useCallback((item: DownlineHistoryItem) => {
    setItems((prev) => {
      const next = [item, ...prev];
      writeStorage(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    writeStorage([]);
    setItems([]);
  }, []);

  return { items, addItem, clearAll };
}
