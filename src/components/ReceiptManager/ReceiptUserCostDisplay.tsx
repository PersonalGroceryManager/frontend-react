function ReceiptUserCostDisplay({
  userIDToNameMap,
  userCosts,
}: {
  userIDToNameMap: Record<number, string>;
  userCosts: Record<number, number>;
}) {
  console.log(userIDToNameMap);
  return (
    <ul className="list-group">
      {Object.entries(userCosts).map(([userID, cost]) => (
        <li className="list-group-item" key={userID}>
          <p style={{ float: "left" }}>{userIDToNameMap[Number(userID)]}</p>
          <h5 style={{ float: "right" }}>£{cost.toFixed(2)}</h5>
        </li>
      ))}
    </ul>
  );
}

export default ReceiptUserCostDisplay;
