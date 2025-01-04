/**
 * This component relies on groupContext and receiptContext
 */

import { SetStateAction, useContext } from "react";
import { GroupContext } from "../contexts/GroupContext";
import {
  fetchReceiptsInGroup,
  ReceiptInfo,
  uploadReceiptToGroup,
} from "../services/receiptService";
import { getGroupIDForName } from "../services/groupService";
import { ReceiptContext } from "../contexts/ReceiptContext";

function ReceiptUploader({
  selectedGroupName,
  setReceiptInfo,
  setReceiptLoaded,
}: {
  selectedGroupName: string | null;
  setReceiptInfo: React.Dispatch<SetStateAction<ReceiptInfo[]>>;
  setReceiptLoaded: React.Dispatch<SetStateAction<boolean>>;
}) {
  // // Use context API to access selected group
  // const groupContext = useContext(GroupContext);
  // if (!groupContext) {
  //   throw new Error(
  //     "Receipt Uploader must be used within a GroupContextProvider"
  //   );
  // }
  // const { selectedGroupName } = groupContext;

  // // Use context API to access refreshReceipt handler
  // const receiptContext = useContext(ReceiptContext);
  // if (!receiptContext) {
  //   throw new Error(
  //     "Receipt Uploader must be used within a ReceiptContextProvider"
  //   );
  // }
  // const { refreshReceipt, setRefreshReceipt } = receiptContext;

  // Only render the uploader when a group is selected
  if (!selectedGroupName) {
    return null;
  }

  // Upload the file to the database
  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    // Ensure a group is selected
    if (!selectedGroupName) {
      return;
    }

    const fileList = event.target.files;

    // Extract only one file from the file list (widget should only enable
    // one file to be uploaded but check in case JS is modified)
    if (!fileList || fileList.length === 0) {
      console.error("No file selected!");
      return;
    }
    const file = fileList[0]; // Get the first file
    const groupID = await getGroupIDForName(selectedGroupName);
    if (!groupID) {
      return;
    }

    const status = await uploadReceiptToGroup(file, groupID);

    // Toggle refresh receipt for a refresh if upload successful
    if (status) {
      setReceiptLoaded(false);
      const receiptData = await fetchReceiptsInGroup(selectedGroupName);
      setReceiptInfo(receiptData);
      setReceiptLoaded(true);
    }
  }

  return (
    <>
      <label htmlFor="upload-receipt" className="form-label mt-3">
        Upload your receipt
      </label>
      <input
        className="form-control"
        type="file"
        id="upload-receipt"
        onChange={handleFileUpload}
      ></input>
    </>
  );
}

export default ReceiptUploader;
