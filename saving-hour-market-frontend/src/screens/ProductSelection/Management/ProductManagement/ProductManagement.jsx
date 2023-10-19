import { useEffect } from "react";
import React from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";


const ProductManagement = () => {
  useEffect(() => {
    fetch(
      `http://localhost:8082/api/product/getProductsForStaff?page=0&limit=5`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImYyZTgyNzMyYjk3MWExMzVjZjE0MTZlOGI0NmRhZTA0ZDgwODk0ZTciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTHV1IEdpYSBWaW5oIChLMTZfSENNKSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKMDFaOG1xUGRLc015Q24wU0o1U0l6OW9fOHotanV1ODIwZU1pZ0E2YmE9czk2LWMiLCJ1c2VyX3JvbGUiOiJTVEFGRl9TTFQiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2Fwc3RvbmUtcHJvamVjdC0zOTgxMDQiLCJhdWQiOiJjYXBzdG9uZS1wcm9qZWN0LTM5ODEwNCIsImF1dGhfdGltZSI6MTY5NzUxMzM4MSwidXNlcl9pZCI6IkFuSEVLcGxYWXdPNGMxdGRkdE94SklTWklsdDEiLCJzdWIiOiJBbkhFS3BsWFl3TzRjMXRkZHRPeEpJU1pJbHQxIiwiaWF0IjoxNjk3NTEzMzgxLCJleHAiOjE2OTc1MTY5ODEsImVtYWlsIjoidmluaGxnc2UxNjExMzVAZnB0LmVkdS52biIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInZpbmhsZ3NlMTYxMTM1QGZwdC5lZHUudm4iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.PRw2cqlKbJMABUENq5httYVUVz3sgpMQiNqDAMVb3Ylyp2TbHpvn5FCjblmT3g65wX-M50Z9RQfWK2SbJ7Lwnk4U01J2l_NCprBeLpx54RzU1UOuuunLoNtDY2HvoO2E1lRh7TAReuCztKbjoH_BNJg4fpOwZ1ZacDz3jEnY84aZP_QOxXOEJZ-170QrQu4FnnxCCSWMZMk1b_tK37qDNk5qSS_NMnHDj5aSqnPz2wOYJuTkk6_zJecdE1fsoDPU4YfQoGBSbk5YFe7hu0W8Xcfa-sFXXkZJH_HqjdlLRDjykWrgyt8ZDs1pCN72JTVizYN_6Gub5xCGlkvruMUbBA`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
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
