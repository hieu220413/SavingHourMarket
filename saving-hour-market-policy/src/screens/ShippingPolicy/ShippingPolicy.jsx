import React, { useEffect, useState } from "react";
import { API } from "../../constant/api";

const ShippingPolicy = () => {
  const [shippingCostPolicy, setShippingCostPolicy] = useState({
    initialShippingFee: 10000,
    minKmDistanceForExtraShippingFee: 2,
    extraShippingFeePerKilometer: 1000,
  });

  useEffect(() => {
    fetch(`${API.baseURL}/api/configuration/getConfiguration`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((respond) => {
        console.log(respond);
        if (respond?.code === 404 || respond.status === 500) {
          return;
        }
        setShippingCostPolicy({
          initialShippingFee: respond.initialShippingFee,
          minKmDistanceForExtraShippingFee:
            respond.minKmDistanceForExtraShippingFee,
          extraShippingFeePerKilometer: respond.extraShippingFeePerKilometer,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="policy__container">
      <div className="policy__main-title">CHÍNH SÁCH GIAO HÀNG</div>
      <h3 className="policy__sub-title">1. Qui định chọn ngày giao hàng</h3>
      <p className="policy__content">
        + Đơn hàng luôn được giao sau 2 ngày kể từ ngày đặt hàng trở đi.
        <br />+ Đơn hàng phải giao trước HSD của sản phẩm có HSD gần nhất một
        ngày.
        <br />+ Nếu sản phẩm có HSD gần nhất cách ngày đặt hàng một hoặc hai
        ngày thì sẽ giao vào ngày hôm sau kể từ ngày đặt hàng
      </p>
      <h3 className="policy__sub-title">2. Chính sách phí giao hàng</h3>
      <p className="policy__content">
        Phí giao hàng sẽ miễn phí đối với đơn hàng được giao tới điểm giao hàng
        <br />
        Với những đơn hàng giao tận nhà, phí giao hàng sẽ được tính như sau :{" "}
        <br />
        Phí giao hàng tính bằng khoảng cách từ địa chỉ của bạn đến địa điểm giao
        hàng đã chọn: dưới {shippingCostPolicy.minKmDistanceForExtraShippingFee}
        km là{" "}
        {shippingCostPolicy.initialShippingFee.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
        , trên {shippingCostPolicy.minKmDistanceForExtraShippingFee}
        km sẽ cộng{" "}
        {shippingCostPolicy.extraShippingFeePerKilometer.toLocaleString(
          "vi-VN",
          {
            style: "currency",
            currency: "VND",
          }
        )}
        /1km
      </p>
    </div>
  );
};

export default ShippingPolicy;
