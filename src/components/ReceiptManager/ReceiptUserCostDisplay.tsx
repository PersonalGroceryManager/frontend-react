function ReceiptUserCostDisplay({
  userIDToNameMap,
  userCosts,
}: {
  userIDToNameMap: Record<number, string>;
  userCosts: Record<number, number>;
}) {
  console.log(userIDToNameMap);
  return (
    <div
      className="d-flex flex-row"
      style={{ justifyContent: "space-between" }}
    >
      {Object.entries(userCosts).map(([userID, cost]) => (
        <div key={userID}>
          {userIDToNameMap[Number(userID)]}: £{cost.toFixed(2)}
        </div>
      ))}
    </div>
  );
}

export default ReceiptUserCostDisplay;
