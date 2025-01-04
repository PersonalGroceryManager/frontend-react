import { useState, useEffect, useContext } from "react";
import { getGroupsJoinedByUser } from "../../services/groupService";
import { GroupContext } from "../../contexts/GroupContext";
import { ReceiptContext } from "../../contexts/ReceiptContext";

function GroupSelectionDropdown() {
  // A list of all group names joined by the user
  const [groupNames, setGroupNames] = useState<string[] | []>([]);

  // Use context API to access selected group
  const groupContext = useContext(GroupContext);
  if (!groupContext) {
    throw new Error(
      "GroupSelectionDropdown must be used within a GroupContextProvider"
    );
  }
  const { setSelectedGroupName } = groupContext;

  // Use context API to access selected receipt
  const receiptContext = useContext(ReceiptContext);
  if (!receiptContext) {
    throw new Error(
      "Receipt Info Card Group must be used within a Receipt Context Provider"
    );
  }
  const { setSelectedReceiptID } = receiptContext;

  // Set the dropdown to be loading at first
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch groups joined by user
  useEffect(() => {
    // Async function to fetch and set GroupData
    const fetchData = async () => {
      try {
        const groupData = await getGroupsJoinedByUser();
        if (groupData) {
          const names = groupData.map((group) => group.group_name);
          setGroupNames(names);
          setSelectedGroupName(names[0]); // Set the first group as the default
        } else {
          setGroupNames([]);
        }
        setIsLoading(false);
      } catch (error) {
        throw new Error("Error fetching groups.");
      } finally {
        setIsLoading(false);
        setSelectedReceiptID(0); // Omit any previous receipt selection
      }
    };
    fetchData();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroupName(event.target.value);
  };

  return (
    <select
      className="form-select"
      aria-label="Select Groups"
      disabled={isLoading || groupNames.length == 0}
      onChange={handleSelectChange}
    >
      {groupNames.length > 0 ? (
        groupNames.map((group, index) => (
          <option key={index} value={group}>
            {group}
          </option>
        ))
      ) : (
        <option>No groups available</option>
      )}
    </select>
  );
}

export default GroupSelectionDropdown;
