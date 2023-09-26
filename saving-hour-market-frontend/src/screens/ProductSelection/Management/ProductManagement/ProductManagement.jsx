import React from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";

const ProductManagement = () => {
  const menuTabs = [
    {
      display: "Siêu thị",
      to: "/supermarketmanagement",
    },
    {
      display: "Sản phẩm",
      to: "/productmanagement",
    },
  ];
  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
    </div>
  );
};

export default ProductManagement;
