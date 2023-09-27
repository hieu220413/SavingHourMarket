import React from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";

const UserManagement = () => {
  const menuTabs = [
    {
      display: "User",
      to: "/usermanagement",
    },
    {
      display: "Feedback",
      to: "/feedbackmanagement",
    },
    {
      display: "Pickup Point",
      to: "/pickuppointmanagement",
    },
    {
      display: "Transaction",
      to: "/transactionmanagement",
    },
  ];
  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
    </div>
  );
};

export default UserManagement;
