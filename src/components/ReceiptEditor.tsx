import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { fetchItemsInReceipts, ItemInfo } from "../services/receiptService";

// Register all Community features
// Important for clientside row
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 *
 * @param {} param0
 * @returns
 */
function ReceiptEditor({ selectedReceiptID }: { selectedReceiptID: number }) {
  // Receipt ID is non-zero. If zero, it means no receipt is currently selected
  if (!selectedReceiptID) {
    return <p>Select a receipt...</p>;
  }

  // Load status of editor
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Update row data based on selected receipt
  useEffect(() => {
    async function fetchAndSetItems() {
      try {
        setIsLoading(true); // Start loading

        console.log(selectedReceiptID);

        const itemData = await fetchItemsInReceipts(selectedReceiptID);

        // Handle the case where no item data is returned
        if (!itemData || itemData.length === 0) {
          console.log("No item data");
          setRowData([]); // Set empty data for the grid
          setIsLoading(false);
          return;
        }

        // Set the column definitions
        const columns = [
          { headerName: "Name", field: "item_name" },
          { headerName: "Quantity", field: "quantity" },
          { headerName: "Weight [kg]", field: "weight" },
          { headerName: "Price [£]", field: "price" },
        ];

        setColDefs(columns);
        setRowData(itemData);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    }

    fetchAndSetItems();
  }, [selectedReceiptID]);

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<ItemInfo[] | []>([]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<any[]>([]); // Type updated

  const autoSizeStrategy = {
    type: "fitGridWidth",
    defaultMinWidth: 100,
    columnLimits: [
      {
        colId: "country",
        minWidth: 900,
      },
    ],
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div style={{ height: 500 }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              autoSizeStrategy={autoSizeStrategy}
            />
          </div>
        </>
      )}
    </>
  );
}

export default ReceiptEditor;
