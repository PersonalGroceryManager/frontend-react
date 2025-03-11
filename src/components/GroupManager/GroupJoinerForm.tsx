import { useEffect, useRef, useState } from "react";
import { joinGroup } from "../../services/groupService";

/**
 * React component rendering a form to join groups
 *
 * @prop onGroupJoin: Function to be executed whenever a group is successfully joined
 * @returns
 */
function GroupJoinerForm({ onGroupJoin }: { onGroupJoin: () => void }) {
  const statusIndicator = useRef<HTMLParagraphElement | null>(null);
  const [groupName, setGroupName] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check that group name is valid
    if (!groupName) {
      return;
    }
    setIsLoading(true);
    const status = await joinGroup(groupName);

    if (status) {
      onGroupJoin();
    } else {
      statusIndicator.current?.classList.remove("offscreen");
      statusIndicator.current?.classList.add("warning");
    }

    setIsLoading(false);
  };

  // Disable the warning whenever the group name is modified
  useEffect(() => {
    statusIndicator.current?.classList.add("offscreen");
    statusIndicator.current?.classList.remove("warning");
  }, [groupName]);

  return (
    <>
      <form className="p-3">
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="groupNameToJoin"
            placeholder="Group Name"
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />
          <label htmlFor="groupNameToJoin">Group Name</label>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="btn btn-primary mb-3"
          disabled={!groupName || isLoading}
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
            "Join Group"
          )}
        </button>
      </form>
      <p className="offscreen mx-2" ref={statusIndicator}>
        <i className="bi bi-exclamation-triangle-fill p-2"></i>Join Group
        Failed. Please try again.
      </p>
    </>
  );
}

export default GroupJoinerForm;
