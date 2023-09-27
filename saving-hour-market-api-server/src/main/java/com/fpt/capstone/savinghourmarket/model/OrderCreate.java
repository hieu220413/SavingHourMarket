package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @NotNull
    private Date deliveryDate;

    private UUID pickupPointId;

    private UUID timeFrameId;

    private Integer status;

    @NotNull
    private Integer payment_method;

    private String addressDeliver;

    private List<UUID> discountID;

    Transaction transaction;

    @NotEmpty
    private List<OrderProduct> orderDetailList;
}
