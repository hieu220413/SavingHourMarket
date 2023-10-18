package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.common.PaymentStatus;
import com.fpt.capstone.savinghourmarket.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderCreate {

    @Positive(message = "Phí giao hàng phải luôn dương!")
    private Integer shippingFee;

    @NotNull
    @Positive(message = "Tổng giá đơn hàng phải luôn dương!")
    private Integer totalPrice;

    @Positive(message = "Tổng giá giảm phải luôn dương!")
    private Integer totalDiscountPrice;

    @NotNull
    private LocalDate deliveryDate;

    @NotNull
    private String receiverPhone;

    @NotNull
    private String receiverName;

    private UUID pickupPointId;

    @NotNull
    private UUID timeFrameId;

    private PaymentStatus paymentStatus;

    @NotNull
    private Integer paymentMethod;

    private String addressDeliver;

    private Float longitude;

    private Float latitude;

    private List<UUID> discountID;

    Transaction transaction;

    @NotEmpty
    private List<OrderProductCreate> orderDetailList;
}
