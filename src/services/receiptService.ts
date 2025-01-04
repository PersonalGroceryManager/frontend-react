const API_BASE_URL = "http://localhost:5000";

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
}

/**
 * Given a group name, obtain its corresponding group ID. Return 0 if no group
 * with the name exists.
 *
 * @param {string} groupName -The group name to search for.
 * @returns
 */
async function resolveGroupName(groupName: string): Promise<number> {
  try {
    const request = new Request(API_BASE_URL + "/groups/resolve/" + groupName, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const response = await fetch(request);
    console.log("Resolve group name response: " + String(response.status));

    if (!response.ok) {
      throw new Error("Group name resolution failed.");
    }

    console.log("Group name resolution successful.");
    const data = await response.json();

    // Response data validation
    if (
      !data ||
      typeof data !== "object" ||
      !("group_id" in data) ||
      !Number.isInteger(data["group_id"])
    ) {
      throw new Error(
        "Invalid response format: 'group_id' missing or malformed"
      );
    }

    return data["group_id"];
  } catch (error) {
    console.log(error);
    return 0;
  }
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
  const group_id = await resolveGroupName(groupName);

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
    console.log(itemInfo);
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
