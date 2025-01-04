import { useState, useEffect } from "react";
import { getGroupsJoinedByUser, GroupData } from "../../services/groupService";
import GroupInfoCard from "./GroupInfoCard";

function GroupManager() {
  // State to hold group data and loading status
  const [groupData, setGroupData] = useState<GroupData[] | null>(null);
  const [fetchedGroups, setFetchedGroups] = useState<boolean>(false);

  // Fetch group data when the component mounts
  useEffect(() => {
    async function fetchGroupData() {
      try {
        const data = await getGroupsJoinedByUser();
        setGroupData(data); // Store fetched group data
      } catch (error) {
        console.error("Error fetching groups:", error);
        setGroupData(null); // Handle errors gracefully
      } finally {
        setFetchedGroups(true); // Set loading status to complete
      }
    }
    fetchGroupData();
  }, []); // Empty dependency array ensures it runs only once

  // Render loading state
  if (!fetchedGroups) {
    return <p>Loading...</p>;
  }

  // Render groups or a message if no groups are found
  return (
    <div id="group-container">
      {groupData && groupData.length > 0 ? (
        groupData.map((group) => (
          <GroupInfoCard
            key={group.group_id}
            group_id={group.group_id}
            group_name={group.group_name}
            description={group.description}
          />
        ))
      ) : (
        <p>No groups found!</p>
      )}
    </div>
  );
}

export default GroupManager;
