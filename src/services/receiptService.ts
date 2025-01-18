import { getUserIDFromName } from "./authService";
import { getGroupIDForName } from "./groupService";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export interface ReceiptInfo {
  receipt_id: number;
  order_id: number;
  slot_time: number;
  total_price: number;
  payment_card: number;
}

export interface ItemInfo {
  item_id: number;
  item_name: string;
  quantity: number;
  weight: number;
  price: number;
  // Key value pair to store user and quantity information
  [key: string]: number | string;
}

export interface UserItemInfo {
  user_id: number;
  item_id: number;
  unit: number;
  item_name?: string;
  quantity?: number;
  weight?: number;
  price?: number;
}

/**
 * Fetch all receipt information linked to group
 *
 * @param {string} groupName - The group name to find the receipts
 * @returns {ReceiptInfo[] | null} The
 */
export const fetchReceiptsInGroup = async (
  groupName: string
): Promise<ReceiptInfo[] | []> => {
  const group_id = await getGroupIDForName(groupName);

  try {
    if (!group_id) {
      throw new Error("No group with group name " + groupName + " found!");
    }

    const request = new Request(`${API_BASE_URL}/groups/${group_id}/receipts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Invalid response: ${response}`);
    }

    // Data parsing and validatiion
    const data = await response.json();
    if (!data || !("receipts" in data)) {
      throw new Error("No receipts found!");
    }

    const receiptInfo: ReceiptInfo[] = data["receipts"];
    return receiptInfo;
  } catch (error) {
    console.log("Error when fetching receipts: " + String(error));
    return [];
  }
};

export const fetchItemsInReceipts = async (receiptID: number) => {
  const request = new Request(`${API_BASE_URL}/receipts/${receiptID}/items`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error("");
    }

    // Data parsing and validatiion
    const itemInfo: ItemInfo[] = await response.json();
    if (!itemInfo || !Array.isArray(itemInfo)) {
      throw new Error(
        "Attempt to fetch items failed because data not arranged as an array."
      );
    }
    return itemInfo;
  } catch (error) {
    console.log("Fetch item failed. " + String(error));
  }
};

export async function fetchUserItemsInReceipt(
  receiptID: number
): Promise<UserItemInfo[] | null> {
  const request = new Request(
    `${API_BASE_URL}/receipts/user-items/${receiptID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  try {
    const response = await fetch(request);
    if (!response.ok) throw new Error("");
    const userItemInfo = await response.json();

    if (!userItemInfo) {
      throw new Error("");
    }

    // Check if there are any user item information
    if (userItemInfo == undefined || userItemInfo.length == 0) {
      console.log("No user data exists.");
    }

    return userItemInfo;
  } catch (error) {
    console.log("Fetching users and item associations failed.");
    return null;
  }
}

/**
 * Upload a receipt to a group. Return True if success, False if failed.
 * @param pdfFile - The file to be uploaded
 * @param groupID - The returned group ID
 * @returns
 */
export const uploadReceiptToGroup = async (
  pdfFile: File,
  groupID: number
): Promise<boolean> => {
  const formData = new FormData();
  formData.append("file", pdfFile, pdfFile.name);
  const request = new Request(`${API_BASE_URL}/groups/${groupID}/receipts`, {
    method: "POST",
    body: formData,
  });

  const response = await fetch(request);

  if (!response.ok) {
    console.log("Upload receipt failed.");
    return false;
  }

  // Uncomment if more precise message to be displayed
  // const responseData = await response.json();
  // return responseData;
  return true;
};

/**
 * Delete a receipt from a group. Return True if success, False if failed.
 * @param receiptID - The receipt ID to be deleted
 * @returns
 */
export const deleteReceiptFromGroup = async (
  receiptID: number
): Promise<boolean> => {
  const request = new Request(`${API_BASE_URL}/receipts/${receiptID}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const response = await fetch(request);

  if (!response.ok) {
    console.log("Failed to delete receipt.");
    return false;
  }

  return true;
};

export const addUserToReceipt = async (
  receiptID: number,
  username: string
): Promise<boolean> => {
  // Convert username to its ID
  const userID = await getUserIDFromName(username);
  if (userID == null) {
    return false;
  }

  const request = new Request(
    `${API_BASE_URL}/receipts/${receiptID}/users/${userID}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  const response = await fetch(request);

  if (!response.ok) {
    console.log(
      `Failed to add user "${username}" to receipt ID: ${receiptID}.`
    );
    return false;
  }

  return true;
};

export const updateUserItemQuanitity = async (
  dataModel: UserItemInfo[]
): Promise<boolean> => {
  const request = new Request(`${API_BASE_URL}/receipts/user-items`, {
    method: "PUT",
    body: JSON.stringify(dataModel),
    headers: { "Content-Type": "application/json" },
  });

  const response = await fetch(request);

  if (!response.ok) {
    console.log("Failed to update user item quantity.");
    return false;
  }
  console.log("Successfully updated user item quantity.");
  return true;
};

export const updateUserCost = async (
  userCost: {
    user_id: number;
    receipt_id: number;
    cost: number | string;
  }[]
): Promise<boolean> => {
  const request = new Request(`${API_BASE_URL}/users/costs`, {
    method: "PUT",
    body: JSON.stringify(userCost),
    headers: { "Content-Type": "application/json" },
  });

  const response = await fetch(request);

  if (!response.ok) {
    console.log("Failed to update user costs.");
    return false;
  }

  console.log("Successfully updated user costs.");
  return true;
};
