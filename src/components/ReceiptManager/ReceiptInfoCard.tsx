/*
This components represents a receipt item that can be clicked on to edit
*/

type ReceiptInfoCardProps = {
  orderID: number;
  slotTime: number;
  totalPrice: number;
  paymentCard: number;
  onSelect: () => void;
  onDelete: () => void;
};

function ReceiptInfoCard({
  // orderID,
  slotTime,
  totalPrice,
  // paymentCard,
  onSelect,
  onDelete,
}: ReceiptInfoCardProps) {
  // Function wrapper to prevent default refresh
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button click behavior
    e.stopPropagation(); // Stop the click event from propagating to the parent (receipt card)
    onDelete(); // Call the delete handler passed as prop
  };

  return (
    <div className="card receipt-card" onClick={onSelect}>
      <button className="close-receipt-btn" onClick={handleDeleteClick}>
        ×
      </button>
      <h5
        className="card-title px-3 py-2"
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
