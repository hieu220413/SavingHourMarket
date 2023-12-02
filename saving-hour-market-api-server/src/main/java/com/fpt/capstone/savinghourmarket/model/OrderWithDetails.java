package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpt.capstone.savinghourmarket.entity.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.validation.constraints.NotNull;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderWithDetails {
    private UUID id;

    private String code;

    private String receiverPhone;

    private String receiverName;

    private Integer shippingFee;

    private Integer totalPrice;

    private Integer totalDiscountPrice;

    private LocalDateTime createdTime;

    private TimeFrame timeFrame;

    private PickupPoint pickupPoint;

    private String addressDeliver;

    private Date deliveryDate;

    private String qrCodeUrl;

    private Integer status;

    private Integer paymentMethod;

    private Integer paymentStatus;

    private Customer customer;

    private List<Transaction> transaction;

    private List<OrderProduct> orderDetailList;
}
