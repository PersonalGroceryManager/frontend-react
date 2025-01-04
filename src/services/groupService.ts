import { getToken, getUserIDFromToken } from "./authService";

const API_BASE_URL = "http://localhost:5000";

export interface GroupData {
  group_id: number;
  group_name: string;
  description: string;
}

/**
 * Get the Group ID given the group name. Return 0 if error.
 * */
export const getGroupIDForName = async (groupName: string): Promise<number> => {
  const request = new Request(API_BASE_URL + `/groups/resolve/${groupName}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const response = await fetch(request);

  if (!response.ok) {
    console.log("Group returned failed.");
    return 0;
  }

  const responseJSON = await response.json();

  if (!responseJSON || !("group_id" in responseJSON)) {
    console.log("getGroupIDForName obtained response in unexpected format.");
    return 0;
  }

  return responseJSON["group_id"];
};

/**
 * Given a user ID, fetch all the groups currently joined by the user
 */
export const getGroupsJoinedByUser = async (): Promise<GroupData[] | []> => {
  const token = getToken();

  const request = new Request(API_BASE_URL + "/users/groups", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  try {
    const response = await fetch(request);

    if (!response.ok) {
      console.log("Invalid response.");
    }
    const data = await response.json();

    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response format: response is not a list");
    }

    // Assemble group names
    const groupNames = data.map((group) => group.group_name);
    console.log("All groups joined by user: ", groupNames);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};


/**
 * Join a group given its group name
 */
export const joinGroup = async (groupName: string): Promise<boolean> => {
  
  const userID = getUserIDFromToken();
  const groupID = await getGroupIDForName(groupName);

  if (!userID || !groupID) {return false;}

  const request = new Request(API_BASE_URL + `/groups/${groupID}/users/${userID}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"}
  });

  const response = await fetch(request);

  if (!response.ok) {
    return false;
  }

  return true;
}

/**
 * Create a group given a group name and an optional description.
 * NOTE: The user that creates this group does not automatically join the group
 * - use joinGroup API to achieve desired behaviour.
 */
export const createGroup = async (groupName: string, description: string | null): Promise<boolean> => {

  // Validate a group name has been provided
  if (!groupName) return false;

  const request = new Request(API_BASE_URL + `/groups`, {
    method: "POST",
    body: JSON.stringify({ "group_name": groupName, "description": description}),
    headers: {"Content-Type": "application/json"}
  });

  const response = await fetch(request);
  if (!response.ok) {return false};

  return true;
}