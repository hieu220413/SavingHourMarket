package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.common.DeliveryMethod;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import lombok.*;

import java.sql.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class OrderPackaging {
    private UUID id;

    private String receiverPhone;

    private String receiverName;

    private Date deliveryDate;

    private DeliveryMethod deliveryMethod;

    private String addressDeliver;

    private TimeFrame timeFrame;

    private PickupPoint pickupPoint;

    private Integer status;
}
