import React from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";

function SuperMarketReport() {
  const menuTabs = [
    {
      display: "Hệ thống",
      to: "/productselectionreport",
    },
    {
      display: "Siêu thị",
      to: "/supermarketreport",
    },
  ];
  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
    </div>
  );
}

export default SuperMarketReport;
