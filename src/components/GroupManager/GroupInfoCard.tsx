import { GroupData } from "../../services/groupService";
import "./GroupCard.css";
/**
 * A card component to show a group, including its profile image, name and description.
 * @param {number} group_id - The group ID
 * @param {string} groupName - The group name to be shown on the card
 * @param {string} groupDescription - The group description to be shown on the card
 * @param {ImageBitmap} groupImage - The group image to be shown on the card
 */

function GroupInfoCard({ group_id, group_name, description }: GroupData) {
  return (
    <div className="card group-card">
      <img
        src="src\assets\defaultGroupIcon.png"
        className="card-img-top group-profile-pic"
        alt={`${group_name} Profile Image`}
      />
      <div className="card-body">
        <h5 className="card-title">{group_name}</h5>
        <p className="card-text">{description}</p>
        <a href="#" className="btn btn-primary">
          Manage
        </a>
      </div>
    </div>
  );
}

export default GroupInfoCard;
