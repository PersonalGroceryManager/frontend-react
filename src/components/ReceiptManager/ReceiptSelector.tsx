import { useEffect, useContext, useState } from "react";
import { GroupContext } from "../../contexts/GroupContext";
import {
  ReceiptInfo,
  deleteReceiptFromGroup,
  fetchReceiptsInGroup,
} from "../../services/receiptService";
import ReceiptInfoCard from "./ReceiptInfoCard";
import { ReceiptContext } from "../../contexts/ReceiptContext";

function ReceiptSelector() {
  // Use context API to access selected group
  const groupContext = useContext(GroupContext);
  if (!groupContext) {
    return null;
  }
  const { selectedGroupName } = groupContext;

  // Early return if no group selected
  if (!selectedGroupName) {
    return <p>Select a group...</p>;
  }

  // Use context API to access selected receipt
  const receiptContext = useContext(ReceiptContext);
  if (!receiptContext) {
    return null;
  }
  const { refreshReceipt, setRefreshReceipt, setSelectedReceiptID } =
    receiptContext;

  // Store all receipt information
  const [receiptInfo, setReceiptInfo] = useState<ReceiptInfo[]>([]);

  // Function to be passed down to individual receipt items as props
  const handleReceiptSelect = (receiptID: number) => {
    // Find the receipt based on receipt ID
    const clickedReceipt = receiptInfo.find(
      (receipt) => receipt["receipt_id"] === receiptID
    );
    if (clickedReceipt) {
      setSelectedReceiptID(clickedReceipt["receipt_id"]);
      console.log("Clicked receipt: ", clickedReceipt["order_id"]);
    }
  };

  // Delete a receipt based on receipt ID
  // Function to be passed down to individual receipt items as props
  const handleReceiptDelete = async (receiptID: number) => {
    const status = await deleteReceiptFromGroup(receiptID);

    // Refresh upon successful deletion by toggling refresh
    if (status) {
      setRefreshReceipt(!refreshReceipt);
    }
  };

  // Fetch receipts whenever a new group is chosen
  useEffect(() => {
    async function fetchReceipts() {
      const receiptData = await fetchReceiptsInGroup(selectedGroupName);
      setReceiptInfo(receiptData);
    }
    fetchReceipts();
  }, [selectedGroupName, refreshReceipt]); // Set refresh receipt as a toggler

  return (
    <div>
      {receiptInfo ? (
        receiptInfo.map((receiptObject) => {
          return (
            <ReceiptInfoCard
              key={receiptObject["receipt_id"]}
              orderID={receiptObject["order_id"]}
              slotTime={receiptObject["slot_time"]}
              totalPrice={receiptObject["total_price"]}
              paymentCard={receiptObject["payment_card"]}
              onSelect={() => handleReceiptSelect(receiptObject["receipt_id"])}
              onDelete={() => handleReceiptDelete(receiptObject["receipt_id"])}
            />
          );
        })
      ) : (
        <p>No receipts found!</p>
      )}
    </div>
  );
}

export default ReceiptSelector;
