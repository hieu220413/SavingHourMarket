package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.District;
import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderBatch;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.exception.*;
import com.fpt.capstone.savinghourmarket.model.OrderCreate;
import com.fpt.capstone.savinghourmarket.model.OrderWithDetails;
import com.fpt.capstone.savinghourmarket.model.ShippingFeeDetailResponseBody;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.maps.errors.ApiException;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    List<OrderGroup> fetchOrderGroups(LocalDate deliverDate, UUID timeFrameId, UUID pickupPointId, UUID delivererId) throws NoSuchOrderException, FirebaseAuthException;

    List<Order> fetchOrdersForStaff(String totalPriceSortType,
                                    String createdTimeSortType,
                                    String deliveryDateSortType,
                                    Date deliveryDate,
                                    OrderStatus orderStatus,
                                    UUID packagerId,
                                    UUID delivererId,
                                    Boolean isPaid,
                                    Boolean isGrouped,
                                    int page,
                                    int limit);

    List<Order> fetchOrdersForPackageStaff(String totalPriceSortType,
                                           String createdTimeSortType,
                                           String deliveryDateSortType,
                                           UUID pickupPointId,
                                           Date deliveryDate,
                                           OrderStatus orderStatus,
                                           String email,
                                           Boolean isPaid,
                                           Boolean isGrouped,
                                           int page,
                                           int limit) throws NoSuchOrderException, FirebaseAuthException, ResourceNotFoundException;

    OrderWithDetails fetchOrderDetail(UUID id) throws ResourceNotFoundException;

    Order createOrder(String jwtToken, OrderCreate orderCreate) throws Exception;

    String cancelOrder(String jwtToken, UUID id) throws ResourceNotFoundException, OrderCancellationNotAllowedException, FirebaseAuthException;

    List<Order> fetchOrdersForCustomer(String jwtToken,
                                       String totalPriceSortType,
                                       String createdTimeSortType,
                                       String deliveryDateSortType,
                                       OrderStatus orderStatus,
                                       Boolean isPaid,
                                       int page,
                                       int limit) throws  FirebaseAuthException;

    ;


    List<OrderBatch> fetchOrderBatches(District district, LocalDate deliveryDate, UUID delivererID) throws NoSuchOrderException;

    String confirmPackaging(UUID orderId, UUID staffId) throws NoSuchOrderException, IOException;

    String assignDeliverToOrderGroupOrBatch(UUID orderGroupId, UUID orderBatchId, UUID staffId) throws NoSuchOrderException, ConflictGroupAndBatchException, IOException;

    String deleteOrder(String jwtToken, UUID id) throws FirebaseAuthException, ResourceNotFoundException, OrderDeletionNotAllowedException;

    @Transactional
    String deleteOrderWithoutAuthen(UUID id) throws FirebaseAuthException, ResourceNotFoundException, OrderDeletionNotAllowedException;

    List<OrderBatch> batchingForStaff(Date deliverDate, UUID timeFrameId, Integer batchQuantity) throws ResourceNotFoundException;

    ShippingFeeDetailResponseBody getShippingFeeDetail(Double latitude, Double longitude) throws IOException, InterruptedException, ApiException;

    String confirmPackaged(UUID orderId, UUID staffId) throws NoSuchOrderException, IOException;

    String confirmSucceeded(UUID orderId, UUID staffId) throws IOException, NoSuchOrderException;

    String confirmFail(UUID orderId, UUID staffId) throws IOException, NoSuchOrderException;
}
