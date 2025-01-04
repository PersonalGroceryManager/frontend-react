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
  orderID,
  slotTime,
  totalPrice,
  paymentCard,
  onSelect,
  onDelete,
}: ReceiptInfoCardProps) {
  return (
    <div className="row mt-3">
      <div className="card p-0" style={{ display: "block" }}>
        <h5 className="card-title px-3 pt-3">{slotTime}</h5>
        <div className="card-body">
          <p className="card-text text-muted">Order ID: {orderID}</p>
          <a href="#" onClick={onSelect} className="btn btn-primary">
            View
            <i
              id="view-icon"
              className="bi bi-arrow-right-square-fill"
              style={{ marginLeft: "1rem" }}
            ></i>
          </a>
          <button
            type="button"
            onClick={onDelete}
            className="btn btn-danger"
            style={{ marginLeft: "1rem" }}
          >
            <i id="delete-icon" className="bi bi-x-square-fill" style={{}}></i>
          </button>
        </div>
        <div className="card-footer">
          <span className="text-muted">Paid by {paymentCard}</span>
          <h5 style={{ textAlign: "right" }}>£ {totalPrice}</h5>
        </div>
      </div>
    </div>
  );
}

export default ReceiptInfoCard;
