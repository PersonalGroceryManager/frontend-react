import React, { useState } from "react";

interface ReceiptContext {
  refreshReceipt: boolean;
  setRefreshReceipt: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGroupName: string;
  setSelectedGroupName: React.Dispatch<React.SetStateAction<string>>;
  selectedReceiptID: number;
  setSelectedReceiptID: React.Dispatch<React.SetStateAction<number>>;
}

export const ReceiptContext = React.createContext<ReceiptContext | undefined>(
  undefined
);

export function ReceiptContextProvider(props: React.PropsWithChildren) {
  const [refreshReceipt, setRefreshReceipt] = useState<boolean>(false);
  const [selectedGroupName, setSelectedGroupName] = useState<string>("");
  const [selectedReceiptID, setSelectedReceiptID] = useState<number>(0);

  const value: ReceiptContext = {
    refreshReceipt,
    setRefreshReceipt,
    selectedGroupName,
    setSelectedGroupName,
    selectedReceiptID,
    setSelectedReceiptID,
  };

  // Return a component that can access group name via `value` attribute
  return (
    <ReceiptContext.Provider value={value}>
      {props.children}
    </ReceiptContext.Provider>
  );
}
