import React, { useState } from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import "./UserManagement.scss";
import StaffManagement from "./StaffManagement";
import CustomerManagement from "./CustomerManagement";

const UserManagement = () => {
  const menuTabs = [
    {
      display: "Tài khoản",
      to: "/usermanagement",
    },
    {
      display: "Góp ý",
      to: "/feedbackmanagement",
    },
    {
      display: "Điểm giao hàng",
      to: "/pickuppointmanagement",
    },
    {
      display: "Giao dịch",
      to: "/transactionmanagement",
    },
  ];

  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
      <StaffManagement />
      <CustomerManagement />
    </div>
  );
};

export default UserManagement;
