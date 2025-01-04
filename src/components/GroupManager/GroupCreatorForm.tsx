import { useEffect, useRef, useState } from "react";
import { createGroup, joinGroup } from "../../services/groupService";

function GroupCreatorForm() {
  const statusIndicator = useRef<HTMLParagraphElement | null>(null);
  const [groupName, setGroupName] = useState<string | null>("");
  const [groupDescription, setGroupDescription] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check that group name is valid
    if (!groupName) {
      return;
    }
    setIsLoading(true);
    const status = await createGroup(groupName, groupDescription);

    if (!status) {
      statusIndicator.current?.classList.remove("offscreen");
      statusIndicator.current?.classList.add("warning");
    }

    setIsLoading(false);

    // Join the group if successful
    if (status) {
      await joinGroup(groupName);
    }
  };

  // Disable the warning whenever the group name is modified
  useEffect(() => {
    statusIndicator.current?.classList.add("offscreen");
    statusIndicator.current?.classList.remove("warning");
  }, [groupName]);

  return (
    <>
      <form className="row">
        <div className="col-auto">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="groupNameToCreate"
              placeholder="Group Name"
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
            />
            <label htmlFor="groupNameToJoin">Group Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="groupDescriptionToCreate"
              placeholder="Description"
              onChange={(e) => {
                setGroupDescription(e.target.value);
              }}
            />
            <label htmlFor="groupNameToCreate">Description</label>
          </div>
        </div>

        <div className="col-auto">
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary mb-3"
            disabled={!groupName}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>{" "}
                Loading
              </>
            ) : (
              "Create a group"
            )}
          </button>
        </div>
      </form>
      <p className="offscreen" ref={statusIndicator}>
        <i className="bi bi-exclamation-triangle-fill p-2"></i>Create Group
        Failed. Please try again.
      </p>
    </>
  );
}

export default GroupCreatorForm;
