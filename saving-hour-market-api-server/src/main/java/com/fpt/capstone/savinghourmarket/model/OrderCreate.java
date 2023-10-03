package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.common.PaymentStatus;
import com.fpt.capstone.savinghourmarket.entity.*;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderCreate {

    @Positive
    private Integer shippingFee;

    @NotNull
    @Positive
    private Integer totalPrice;

    @Positive
    private Integer totalDiscountPrice;

    @NotNull
    private LocalDate deliveryDate;

    @NotNull
    private String receiverPhone;

    @NotNull
    private String receiverName;

    private UUID pickupPointId;

    private UUID timeFrameId;

    private PaymentStatus paymentStatus;

    @NotNull
    private Integer paymentMethod;

    private String addressDeliver;

    private List<UUID> discountID;

    Transaction transaction;

    @NotEmpty
    private List<OrderProductCreate> orderDetailList;
}
