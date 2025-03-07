import React, { useState, useEffect, SetStateAction } from "react";
import ReceiptEditor from "../components/ReceiptManager/ReceiptEditor";
import ReceiptUploader from "../components/ReceiptManager/ReceiptUploader";
import ReceiptInfoCard from "../components/ReceiptManager/ReceiptInfoCard";
import {
  deleteReceiptFromGroup,
  fetchReceiptsInGroup,
  ReceiptInfo,
} from "../services/receiptService";
import { getGroupsJoinedByUser } from "../services/groupService";

// Style sheets
import "./ReceiptsPage.css";

function ReceiptsPage() {
  // State to store all available group names
  const [groupNames, setGroupNames] = useState<string[] | []>([]);

  // State to store selected group names
  const [selectedGroupName, setSelectedGroupName] = useState<string>("");

  // State to store all receipt information in group
  const [receiptInfo, setReceiptInfo] = useState<ReceiptInfo[]>([]);

  // State to store selected receipt (default to zero - no receipt selected)
  const [selectedReceiptID, setSelectedReceiptID] = useState<number>(0);

  // States to store loading information of each information
  const [groupLoaded, setGroupLoaded] = useState<boolean>(false);
  const [receiptLoaded, setReceiptLoaded] = useState<boolean>(false);

  return (
    <>
      <div className="container" id="receipt-page-container">
        <div className="item" id="filters-area">
          <GroupSelector
            groupNames={groupNames}
            setGroupNames={setGroupNames}
            setSelectedGroupName={setSelectedGroupName}
            groupLoaded={groupLoaded}
            setGroupLoaded={setGroupLoaded}
            setSelectedReceiptID={setSelectedReceiptID}
          />
          <ReceiptUploader
            selectedGroupName={selectedGroupName}
            setReceiptLoaded={setReceiptLoaded}
            setReceiptInfo={setReceiptInfo}
          />
        </div>
        <div className="item scroll-container-x" id="receipts-area">
          <ReceiptList
            selectedGroupName={selectedGroupName}
            receiptInfo={receiptInfo}
            setReceiptInfo={setReceiptInfo}
            groupLoaded={groupLoaded}
            receiptLoaded={receiptLoaded}
            setReceiptLoaded={setReceiptLoaded}
            selectedReceiptID={selectedReceiptID}
            setSelectedReceiptID={setSelectedReceiptID}
          />
        </div>
        <div className="item" id="receipt-editor-area">
          <ReceiptEditor
            selectedReceiptID={selectedReceiptID}
            selectedGroupName={selectedGroupName}
          />
        </div>
      </div>
    </>
  );
}

export default ReceiptsPage;

function GroupSelector({
  groupNames,
  setGroupNames,
  setSelectedGroupName,
  groupLoaded,
  setGroupLoaded,
  setSelectedReceiptID,
}: {
  groupNames: string[];
  setGroupNames: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedGroupName: React.Dispatch<React.SetStateAction<string>>;
  groupLoaded: boolean;
  setGroupLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedReceiptID: React.Dispatch<React.SetStateAction<number>>;
}) {
  // Async function to fetch and set group data (Only run upon first load)
  const fetchGroupData = async () => {
    setGroupLoaded(false);
    const groupData = await getGroupsJoinedByUser();
    const names = groupData.map((group) => group.group_name);
    setGroupNames(names);
    setSelectedGroupName(names[0]); // Default to first group
    setGroupLoaded(true);
  };
  useEffect(() => {
    fetchGroupData();
  }, []);

  // When loading - fetching data
  if (!groupLoaded) {
    return (
      <>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  // Completed fetching data but no group found
  else if (!groupNames) {
    return (
      <select
        className="form-select"
        aria-label="Select Groups"
        disabled={true}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedGroupName(event.target.value);
        }}
      >
        <option>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Loading...
        </option>
      </select>
    );
  }

  // Completed fetching data but groups found
  else {
    return (
      <select
        className="form-select"
        aria-label="Select Groups"
        disabled={false}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedGroupName(event.target.value);
          setSelectedReceiptID(0); // Remove any selected receipt
        }}
      >
        {groupNames.map((group, index) => (
          <option key={index} value={group}>
            {group}
          </option>
        ))}
      </select>
    );
  }
}

function ReceiptList({
  selectedGroupName,
  receiptInfo,
  setReceiptInfo,
  groupLoaded,
  receiptLoaded,
  setReceiptLoaded,
  selectedReceiptID,
  setSelectedReceiptID,
}: {
  selectedGroupName: string | null;
  receiptInfo: ReceiptInfo[];
  setReceiptInfo: React.Dispatch<SetStateAction<ReceiptInfo[]>>;
  groupLoaded: boolean;
  receiptLoaded: boolean;
  setReceiptLoaded: React.Dispatch<SetStateAction<boolean>>;
  selectedReceiptID: number;
  setSelectedReceiptID: React.Dispatch<SetStateAction<number>>;
}) {
  // Async function to fetch and set receipt data
  const fetchReceiptData = async () => {
    // Error handling
    if (!selectedGroupName) {
      console.log("Attempting to fetch receipt data without a selected group!");
      setReceiptLoaded(true);
      return;
    }

    setReceiptLoaded(false);
    const receiptData = await fetchReceiptsInGroup(selectedGroupName);
    setReceiptInfo(receiptData);
    setReceiptLoaded(true);
  };

  // Set the receipt ID
  const handleReceiptSelect = (receiptID: number) => {
    // Find the receipt based on receipt ID
    const clickedReceipt = receiptInfo.find(
      (receipt) => receipt["receipt_id"] === receiptID
    );
    if (clickedReceipt) {
      setSelectedReceiptID(clickedReceipt["receipt_id"]);
    }
  };

  // Delete a receipt based on receipt ID
  const handleReceiptDelete = async (receiptID: number) => {
    setReceiptLoaded(false);
    const status = await deleteReceiptFromGroup(receiptID);

    // Refresh upon successful deletion by toggling refresh
    if (status) {
      fetchReceiptData();
      // If the receipt to be deleted is the currently selected, reset
      if (receiptID === selectedReceiptID) {
        setSelectedReceiptID(0);
      }
    }
    setReceiptLoaded(true);
  };

  // Refetch data whenever a new group is chosen
  useEffect(() => {
    fetchReceiptData();
  }, [groupLoaded]);

  // When groups or receipts are loading
  if (!groupLoaded || !receiptLoaded) {
    return (
      <div className="text-center mt-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // When group data is fetched but no groups found
  else if (groupLoaded && !selectedGroupName) {
    return <p>You need to join a group to view receipts</p>;
  }

  // When data is fetched but no receipts found
  else if (receiptInfo.length === 0) {
    return <p>No receipts found</p>;
  }

  // If receipts are found within the group
  else {
    return (
      <>
        {receiptInfo.map((receiptObject) => {
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
        })}
      </>
    );
  }
}
