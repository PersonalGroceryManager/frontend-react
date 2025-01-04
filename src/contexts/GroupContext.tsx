import React, { useState } from "react";

interface GroupContextType {
  selectedGroupName: string;
  setSelectedGroupName: React.Dispatch<React.SetStateAction<string>>;
}

export const GroupContext = React.createContext<GroupContextType | undefined>(
  undefined
);

export function GroupContextProvider(props: React.PropsWithChildren) {
  const [selectedGroupName, setSelectedGroupName] = useState<string>("");

  const value: GroupContextType = { selectedGroupName, setSelectedGroupName };

  console.log("GroupContext Provider Value:", { selectedGroupName });

  // Return a component that can access group name via `value` attribute
  return (
    <GroupContext.Provider value={value}>
      {props.children}
    </GroupContext.Provider>
  );
}
