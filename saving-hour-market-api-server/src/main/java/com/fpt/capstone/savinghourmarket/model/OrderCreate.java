package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpt.capstone.savinghourmarket.entity.*;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class OrderCreate {

    private Integer shippingFee;

    private Integer totalPrice;

    private LocalDateTime createdTime;

    private Date deliveryDate;

    private Integer status;

    private Integer payment_method;

    private String addressDeliver;

    private String customerEmail;

    private String discountId;

    Transaction transaction;

    private List<OrderProduct> orderDetailList;
}
