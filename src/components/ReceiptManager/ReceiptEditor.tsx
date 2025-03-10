import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AgGridEvent, ColDef } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import {
  fetchItemsInReceipts,
  fetchUserItemsInReceipt,
  ItemInfo,
} from "../../services/receiptService";
import { getUserIDsInGroup } from "../../services/groupService";
import { getUsernameFromID } from "../../services/authService";
import ReceiptEditorSaveButton from "./ReceiptEditorSaveButton";
import ReceiptEditorUserAdder from "./ReceiptEditorUserAdder";
import ReceiptUserCostDisplay from "./ReceiptUserCostDisplay";

// Register all Community features - Important for AG Grid clientside row
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 *
 * @param {} param0
 * @returns
 */
function ReceiptEditor({
  selectedReceiptID,
  selectedGroupName,
}: {
  selectedReceiptID: number;
  selectedGroupName: string;
}) {
  // React State
  const gridRef = useRef<AgGridReact>(null);
  const [userIDToNameMap, setUserIDToNameMap] = useState<
    Record<number, string>
  >({});
  const [usernamesNotInReceipt, setUsernamesNotInReceipt] = useState<string[]>(
    []
  );
  const [userCosts, setUserCosts] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [rowData, setRowData] = useState<ItemInfo[] | []>([]); // Data Model
  const [colDefs, setColDefs] = useState<any[]>([]); // Column Definition

  const onGridReady = () => {
    if (gridRef.current) {
      gridRef.current.api.sizeColumnsToFit();
    }
  };

  // Runs when receipt ID is updated or refresh toggled manually
  useEffect(() => {
    // Primary function that runs on receipt selection to update data model
    async function fetchAndSetItems() {
      try {
        setIsLoading(true);
        console.log("Selected Receipt with ID: ", selectedReceiptID);
        const itemData = await fetchItemsInReceipts(selectedReceiptID);

        // Handle the case where no item data is returned
        if (!itemData || itemData.length === 0) {
          console.log("No item data");
          setRowData([]); // Set empty data for the grid
          setIsLoading(false);
          return;
        }

        // Get user (names and IDs) in this group
        const userIDsInGroupData = await getUserIDsInGroup(selectedGroupName);
        let idToNameMap: Record<number, string> = {};
        let usernamesInGroupData: string[] = [];

        // Construct the hash map mapping user ID to usernames for users of this group
        for (const userID of userIDsInGroupData) {
          const username = await getUsernameFromID(userID);
          if (!username) continue;
          idToNameMap[userID] = username;
          usernamesInGroupData.push(username);
        }
        setUserIDToNameMap(idToNameMap);

        // Get user-item associations
        const userItemData = await fetchUserItemsInReceipt(selectedReceiptID);
        const userIDsWithItem = [
          ...new Set(
            userItemData?.map((userItemInfo) => userItemInfo["user_id"])
          ),
        ];
        if (!userIDsWithItem) return;
        const usernamesWithItem: string[] = userIDsWithItem.map(
          (userID) => idToNameMap[userID]
        );

        // Find out which users is part of the group but not added to receipt
        const filteredUsernames = usernamesInGroupData.filter(
          (item) => !usernamesWithItem.includes(item)
        );
        setUsernamesNotInReceipt(filteredUsernames);

        // Set the column definitions
        const columns: ColDef[] = [
          { headerName: "Name", field: "item_name", minWidth: 300 },
          { headerName: "Quantity", field: "quantity" },
          { headerName: "Weight [kg]", field: "weight" },
          { headerName: "Price [£]", field: "price" },
        ];

        // Add a column for each user
        for (let n = 0; n <= userIDsWithItem.length; n++) {
          let id = userIDsWithItem[n];
          let name = usernamesWithItem[n];
          if (id && name) {
            columns.push({
              headerName: name,
              field: id.toString(),
              editable: true,
            });
          }
        }
        if (userItemData) {
          for (let i = 0; i < userItemData.length; i++) {
            let userItemDataRow = userItemData[i];
            let userID = userItemDataRow["user_id"];
            let itemID = userItemDataRow["item_id"];
            let unit = userItemDataRow["unit"];

            // Find the ItemInfo entry for the current itemID in itemData
            let item = itemData.find((item) => item.item_id === itemID);

            // If the item is found, update its users field
            if (item) {
              // Add or update the user's unit in the users map
              item[userID.toString()] = unit;
            }
          }
          setUserCosts(calculateUserCost(itemData));
        }
        setColDefs(columns);
        setRowData(itemData);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    }

    fetchAndSetItems();
  }, [selectedReceiptID, refresh]);

  const onCellValueChanged = async (event: AgGridEvent) => {
    const updatedRowData: any[] = [];
    event.api.forEachNode((node) => updatedRowData.push(node.data));

    console.log("Updated Row Data:", updatedRowData);

    // Update state with the calculated user costs
    setUserCosts(calculateUserCost(updatedRowData));
  };

  // Receipt ID is non-zero. If zero, it means no receipt is currently selected
  if (!selectedReceiptID) {
    return <p>Select a receipt...</p>;
  }

  return (
    <>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          <div id="receipt-editor-results" className="col-2">
            {userIDToNameMap &&
              userCosts &&
              Object.keys(userIDToNameMap).length > 0 &&
              Object.keys(userCosts).length > 0 && (
                <ReceiptUserCostDisplay
                  userIDToNameMap={userIDToNameMap}
                  userCosts={userCosts}
                />
              )}
            <ReceiptEditorUserAdder
              usernamesNotInReceipt={usernamesNotInReceipt}
              setUsernamesNotInReceipt={setUsernamesNotInReceipt}
              receiptID={selectedReceiptID}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>
          <div id="receipt-editor-table" className="col-10">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={colDefs}
              onGridReady={onGridReady}
              onCellValueChanged={onCellValueChanged}
            />
            <ReceiptEditorSaveButton
              DataModel={rowData}
              receiptID={selectedReceiptID}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ReceiptEditor;

function calculateUserCost(DataModel: ItemInfo[]): Record<number, number> {
  const userCosts: { [userID: number]: number } = {};
  DataModel.forEach((row) => {
    // Calculate total selected units in this row
    // const totalSelectedUnits = Object.entries(row)
    //   // Filter out non user ID column names
    //   .filter(([colName, _]) => !isNaN(Number(colName)))
    //   .reduce(
    //     (rowSum, [_, userSelectedUnits]) =>
    //       rowSum + (userSelectedUnits as number),
    //     0
    //   );

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

  return userCosts;
}
