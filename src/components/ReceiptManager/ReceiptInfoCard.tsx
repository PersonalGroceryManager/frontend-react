/*
This components represents a receipt item that can be clicked on to edit
*/

import { useRef, useContext, useEffect } from "react";
import { ReceiptContext } from "../../contexts/ReceiptContext";

type ReceiptInfoCardProps = {
  receiptID: number;
  orderID: number;
  slotTime: number;
  totalPrice: number;
  paymentCard: number;
  onSelect: () => void;
  onDelete: () => void;
};

function ReceiptInfoCard({
  receiptID,
  // orderID,
  slotTime,
  totalPrice,
  // paymentCard,
  onSelect,
  onDelete,
}: ReceiptInfoCardProps) {
  // Access the selected receipt ID from context
  const receiptContext = useContext(ReceiptContext);
  if (!receiptContext) {
    throw new Error("ReceiptInfoCard must be used within receiptContext!");
  }
  const { selectedReceiptID } = receiptContext;

  // Feature to change receipt style when selected
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (receiptID === selectedReceiptID) {
      cardRef?.current?.classList.add("receipt-active");
    } else {
      cardRef?.current?.classList.remove("receipt-active");
    }
  }, [selectedReceiptID]);

  // Function wrapper for delete to prevent default refresh
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button click behavior
    e.stopPropagation(); // Stop the click event from propagating to the parent (receipt card)
    onDelete(); // Call the delete handler passed as prop
  };

  return (
    <div
      ref={cardRef}
      // style={activeCardStyle}
      className="card receipt-card"
      onClick={onSelect}
    >
      <button className="close-receipt-btn" onClick={handleDeleteClick}>
        ×
      </button>
      <h5
        className="card-title px-3 py-2 m-0"
        style={{ backgroundColor: "#B2BEB5" }}
      >
        Sainsbury's
      </h5>

      <div
        className="card-body"
        id="receipt-info-area"
        style={{ padding: "10px" }}
      >
        {/* Convert "Thu, 30 May 2024 12:00:00 GMT" to "30 May 2024" */}
        {new Date(slotTime).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
        <h5 style={{ textAlign: "right" }}>£ {totalPrice}</h5>
      </div>
    </div>
  );
}

export default ReceiptInfoCard;
