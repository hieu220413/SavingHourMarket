package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderDetail;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderWithDetailAndCustomer {
    public OrderWithDetailAndCustomer(Order order) {
        this.id = order.getId();
        this.receiverPhone = order.getReceiverPhone();
        this.receiverName = order.getReceiverName();
        this.addressDeliver = order.getAddressDeliver();
        this.status = order.getStatus();
        this.orderDetailList = order.getOrderDetailList();
    }

    private UUID id;
    private String receiverPhone;
    private String receiverName;
    private String addressDeliver;
    private Integer status;
    private List<OrderDetail> orderDetailList;

}
