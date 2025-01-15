import { useState } from "react";
import {
  ItemInfo,
  updateUserCost,
  updateUserItemQuanitity,
} from "../../services/receiptService";

function ReceiptEditorSaveButton({
  DataModel,
  receiptID,
}: {
  DataModel: ItemInfo[];
  receiptID: number;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Validate there is content
    if (DataModel.length === 0) {
      console.log("Attempted save with no content!");
      return;
    }

    setIsLoading(true);

    // Prepare user quantity information
    const UserQuantityModel = DataModel.flatMap((row) => {
      return (
        Object.entries(row)
          // Filter out non user ID keys
          .filter(([key, _]) => !isNaN(Number(key)))
          .map(([userID, unit]) => ({
            user_id: Number(userID), // Convert the string key to a number
            item_id: row.item_id as number, // Assert the type of item__id
            unit: unit as number, // Assert the type of unit
          }))
      );
    });

    // Prepare user cost information
    const userCosts: { [userID: number]: number } = {};

    DataModel.forEach((row) => {
      // Calculate total selected units in this row
      const totalSelectedUnits = Object.entries(row)
        // Filter out non user ID column names
        .filter(([colName, _]) => !isNaN(Number(colName)))
        .reduce(
          (rowSum, [_, userSelectedUnits]) =>
            rowSum + (userSelectedUnits as number),
          0
        );

      // Calculate total quantity available (either weight or quantity)
      const totalQuantity = row.quantity ?? row.weight;
      const pricePerUnit = row.price / totalQuantity;

      // Calculate cost of each user
      Object.entries(row)
        .filter(([colName, _]) => !isNaN(Number(colName)))
        .forEach(([strUserID, userSelectedUnits]) => {
          const userID = Number(strUserID);
          const userCost = (userSelectedUnits as number) * pricePerUnit;
          if (userCosts[userID]) {
            userCosts[userID] += userCost;
          }
          // Set for first time
          else {
            userCosts[userID] = userCost;
          }
        });
    });

    const UserCostModel = Object.entries(userCosts).map(([userId, cost]) => ({
      user_id: Number(userId),
      receipt_id: receiptID, // Add the receipt_id field here
      cost: cost.toFixed(2), // Format cost to 2 decimal places
    }));

    const itemStatus = await updateUserItemQuanitity(UserQuantityModel);
    const costStatus = await updateUserCost(UserCostModel);

    setIsLoading(false);
  };

  return (
    <button
      type="button"
      className="btn btn-primary col-12 mt-2"
      onClick={handleSave}
      disabled={isLoading}
    >
      {isLoading ? "Loading" : "Save Changes"}
    </button>
  );
}

export default ReceiptEditorSaveButton;
