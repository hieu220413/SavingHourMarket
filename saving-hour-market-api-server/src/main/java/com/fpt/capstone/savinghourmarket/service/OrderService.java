package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.District;
import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderBatch;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
import com.fpt.capstone.savinghourmarket.exception.OrderCancellationNotAllowedException;
import com.fpt.capstone.savinghourmarket.exception.OutOfProductQuantityException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.OrderCreate;
import com.fpt.capstone.savinghourmarket.model.OrderProduct;
import com.google.firebase.auth.FirebaseAuthException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    List<OrderGroup> fetchOrderGroups(String jwtToken, LocalDate deliverDate, UUID timeFrameId, UUID pickupPointId, UUID delivererId) throws NoSuchOrderException, FirebaseAuthException;

    List<Order> fetchOrdersForStaff(String jwtToken,
                                    String totalPriceSortType,
                                    String createdTimeSortType,
                                    String deliveryDateSortType,
                                    OrderStatus orderStatus,
                                    UUID packagerId,
                                    Boolean isPaid,
                                    Boolean isGrouped,
                                    int page,
                                    int limit) throws NoSuchOrderException, FirebaseAuthException, ResourceNotFoundException;
    List<OrderProduct> fetchOrderDetail(UUID id) throws ResourceNotFoundException;
    String createOrder(String jwtToken, OrderCreate orderCreate) throws Exception, OutOfProductQuantityException;
    String cancelOrder(String jwtToken, UUID id) throws ResourceNotFoundException, OrderCancellationNotAllowedException, FirebaseAuthException;
    List<Order> fetchOrdersForCustomer(String jwtToken,
                                       String totalPriceSortType,
                                       String createdTimeSortType,
                                       String deliveryDateSortType,
                                       OrderStatus orderStatus,
                                       Boolean isPaid,
                                       int page,
                                       int limit) throws NoSuchOrderException, FirebaseAuthException, ResourceNotFoundException;;

    List<OrderBatch> fetchOrderBatches(String jwtToken, District district, LocalDate deliveryDate) throws NoSuchOrderException;
}
