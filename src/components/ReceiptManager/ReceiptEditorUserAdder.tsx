import { useState } from "react";
import { addUserToReceipt } from "../../services/receiptService";

function ReceiptEditorUserAdder({
  usernamesNotInReceipt,
  setUsernamesNotInReceipt,
  receiptID,
  refresh,
  setRefresh,
}: {
  usernamesNotInReceipt: string[];
  setUsernamesNotInReceipt: React.Dispatch<React.SetStateAction<string[]>>;
  receiptID: number;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<string[]>([]);
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUsernames = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedUsersToAdd(selectedUsernames);
  };

  const handleAddUsersToReceipt = async () => {
    for (let i = 0; i < selectedUsersToAdd.length; i++) {
      let status = await addUserToReceipt(receiptID, selectedUsersToAdd[i]);
      // If add user failed, raise some warning
      if (!status) {
        console.log("Adding user failed.");
        return;
      }
      // Remove newly added users from usernamesNotInReceipt
      const updatedUsernamesNotInReceipt = usernamesNotInReceipt.filter(
        (username) => !selectedUsersToAdd.includes(username)
      );
      setUsernamesNotInReceipt(updatedUsernamesNotInReceipt);
    }

    // Configure manual refresh
    setRefresh(!refresh);
  };

  return (
    <>
      <select
        className="form-select mt-3"
        multiple
        aria-label="add users to receipt"
        onChange={handleSelectChange}
      >
        {usernamesNotInReceipt.length > 0 ? (
          usernamesNotInReceipt.map((username) => {
            return (
              <option key={username} value={username}>
                {username}
              </option>
            );
          })
        ) : (
          <option disabled>No users left to add</option>
        )}
      </select>
      <button
        type="button"
        className="btn btn-primary mt-1"
        disabled={selectedUsersToAdd.length === 0}
        onClick={handleAddUsersToReceipt}
      >
        Add to Receipt
      </button>
    </>
  );
}

export default ReceiptEditorUserAdder;
