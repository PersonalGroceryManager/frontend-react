import { useState, useEffect, useRef, useContext } from "react";
import { getGroupsJoinedByUser, GroupData } from "../../services/groupService";
import { ReceiptContext } from "../../contexts/ReceiptContext";
import GroupCreatorForm from "./GroupCreatorForm";
import GroupJoinerForm from "./GroupJoinerForm";
import CustomModal from "../CustomModal";
import UserSpendingPlot from "../UserSpendingPlot";
import { useNavigate } from "react-router-dom";

function GroupManager() {
  const receiptContext = useContext(ReceiptContext);
  if (!receiptContext) {
    throw new Error(
      "Group Manager must be used within a ReceiptContextProvider"
    );
  }

  const { setSelectedGroupName, setSelectedReceiptID } = receiptContext;

  const navigate = useNavigate();

  // State to hold a list of group data
  const [groupData, setGroupData] = useState<GroupData[] | null>(null);

  // State to hold loading status of groups
  const [fetchedGroups, setFetchedGroups] = useState<boolean>(false);

  // Reference to modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  // Function to close the modal programmatically
  const closeModal = () => {
    if (modalRef.current) {
      // Remove the 'show' class to hide the modal
      modalRef.current.classList.remove("show");
    }
    // Remove the backdrop manually (THIS WORKS but not elegant)
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.remove();
    }
  };

  // Function to fetch group data and update state
  async function fetchGroupData() {
    setFetchedGroups(false);
    try {
      const data = await getGroupsJoinedByUser();
      setGroupData(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroupData(null);
    } finally {
      // Set loading status to complete
      setFetchedGroups(true);
      closeModal();
    }
  }

  async function handleGroupSelect(event: React.MouseEvent<HTMLAnchorElement>) {
    const selectedName: string | null =
      event.currentTarget.getAttribute("data-key");

    // Just required for type-safety: this string will not be empty
    if (!selectedName) {
      return;
    }
    setSelectedGroupName(selectedName);

    // Forget about receipts (if any). Ensure no prior receipt chosen
    setSelectedReceiptID(0);

    // Navigate to receipts page after group is selected and receipt refreshed
    navigate("/receipts");
  }

  // Fetch group data when the component mounts
  useEffect(() => {
    fetchGroupData();
  }, []);

  // Render loading state
  if (!fetchedGroups) {
    return <p>Loading...</p>;
  }

  // Render groups or a message if no groups are found
  return (
    <>
      {/* Modal to join group */}
      <CustomModal title="Create/Join Group" id="group-modal" ref={modalRef}>
        <GroupCreatorForm onGroupAdded={fetchGroupData} />
        <hr style={{ width: "90%", margin: "auto" }} />
        <GroupJoinerForm onGroupJoin={fetchGroupData} />
      </CustomModal>

      <div className="container-fluid row">
        <div className="col-md-3 col-lg-2 d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
          <div className="list-group list-group-flush border-bottom scrollarea">
            <a
              href="/"
              className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom"
            >
              <span className="fs-5 fw-semibold">
                Groups {"  "}
                <button
                  className="btn btn-light"
                  data-bs-toggle="modal"
                  data-bs-target="#group-modal"
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </span>
              {/* Button to add groups */}
            </a>

            {groupData && groupData.length > 0 ? (
              groupData.map((group) => (
                <a
                  className="list-group-item list-group-item-action py-3 lh-tight"
                  aria-current="true"
                  key={group.group_name}
                  data-key={group.group_name}
                  onClick={handleGroupSelect}
                >
                  <div className="d-flex w-100 align-items-center justify-content-between">
                    <strong className="mb-1">{group.group_name}</strong>
                    {/* <small>Wed</small> */}
                  </div>
                  <div className="col-10 mb-1 small">{group.description}</div>
                </a>
              ))
            ) : (
              <p>No groups found!</p>
            )}
          </div>
        </div>
        <div
          className="col-md-9 col-lg-10"
          style={{ border: "1px solid #eeeae7" }}
        >
          <UserSpendingPlot />
        </div>
      </div>
    </>
  );
}

export default GroupManager;
