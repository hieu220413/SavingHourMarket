import React from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import "./TransactionManagement.scss";
import SuccessTransactionManagement from "./SuccessTransactionManagement";
import RefundTransactionManagement from "./RefundTransactionManagement";

const TransactionManagement = () => {
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
    {
      display: "Khung giờ",
      to: "/timeframemanagement",
    },
    {
      display: "Điểm tập kết",
      to: "/consolidationmanagement",
    },
  ];

  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
      <SuccessTransactionManagement />
      <RefundTransactionManagement />
    </div>
  );
};

export default TransactionManagement;
