import GroupCreatorForm from "../components/GroupManager/GroupCreatorForm";
import GroupJoinerForm from "../components/GroupManager/GroupJoinerForm";
import GroupManager from "../components/GroupManager/GroupManager";

function Dashboard() {
  return (
    <div className="container">
      <h1>Your Groups</h1>
      <GroupManager />
      <h2>Join a group</h2>
      <GroupJoinerForm />
      <h2>Create a group</h2>
      <GroupCreatorForm />
    </div>
  );
}

export default Dashboard;
