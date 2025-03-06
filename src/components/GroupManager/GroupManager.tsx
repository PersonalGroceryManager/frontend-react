import { useState, useEffect, useRef } from "react";
import { getGroupsJoinedByUser, GroupData } from "../../services/groupService";
import GroupCreatorForm from "./GroupCreatorForm";
import GroupJoinerForm from "./GroupJoinerForm";
import CustomModal from "../CustomModal";
import UserSpendingPlot from "../UserSpendingPlot";

function GroupManager() {
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
      <CustomModal title="Create Group" id="exampleModal" ref={modalRef}>
        <GroupCreatorForm onGroupAdded={fetchGroupData} />
      </CustomModal>

      <div className="container-fluid">
        <div className="row">
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
                    data-bs-target="#exampleModal"
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
                    href="#"
                    className="list-group-item list-group-item-action py-3 lh-tight"
                    aria-current="true"
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
          <div className="col-md-9 col-lg-10">
            <UserSpendingPlot />
          </div>
          <GroupJoinerForm onGroupJoin={fetchGroupData} />
        </div>
      </div>
    </>
  );
}

export default GroupManager;
