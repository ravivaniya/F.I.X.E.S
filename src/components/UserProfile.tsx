import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

// Issue: unused variable
const UNUSED_CONSTANT = "not used anywhere";

function UserProfile({ user }: { user: User }) {
  // Issue: unused state
  const [unusedState, setUnusedState] = useState("");

  // Issue: unused variable
  let unusedCounter = 0;

  // Issue: console.log
  console.log("UserProfile rendered for user:", user.id);

  // Issue: unused expression
  user.email;

  // Issue: var usage
  var profileClass = "user-profile";

  return (
    <div className={profileClass}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

export default UserProfile;
