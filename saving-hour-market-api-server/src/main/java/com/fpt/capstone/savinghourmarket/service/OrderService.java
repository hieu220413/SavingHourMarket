package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.*;
import com.fpt.capstone.savinghourmarket.entity.*;
import com.fpt.capstone.savinghourmarket.exception.*;
import com.fpt.capstone.savinghourmarket.model.*;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.maps.errors.ApiException;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface OrderService {
    List<Order> fetchOrdersForStaff(String totalPriceSortType,
                                    String createdTimeSortType,
                                    String deliveryDateSortType,
                                    Boolean getOldOrder,
                                    Date deliveryDate,
                                    OrderStatus orderStatus,
                                    UUID packagerId,
                                    UUID delivererId,
                                    Boolean isPaid,
                                    Boolean isGrouped,
                                    Boolean isBatched,
                                    int page,
                                    int limit);

    List<Order> fetchOrdersForCustomer(String jwtToken,
                                       String totalPriceSortType,
                                       String createdTimeSortType,
                                       String deliveryDateSortType,
                                       OrderStatus orderStatus,
                                       Boolean isPaid,
                                       int page,
                                       int limit) throws FirebaseAuthException;

    List<OrderBatch> fetchOrderBatches(Integer status,Boolean getOldOrderBatch, SortType deliverDateSortType, LocalDate deliveryDate, UUID delivererID) throws NoSuchOrderException;

    OrderGroupPageResponse fetchOrderGroups(OrderStatus status,
                                      SortType deliverDateSortType,
                                      LocalDate deliverDate,
                                      Boolean getOldOrder,
                                      UUID timeFrameId,
                                      UUID pickupPointId,
                                      UUID delivererId,
                                      Integer page,
                                      Integer size) throws FirebaseAuthException;

    List<Order> fetchOrdersForPackageStaff(String totalPriceSortType,
                                           String createdTimeSortType,
                                           String deliveryDateSortType,
                                           Boolean getOldOrderGroup,
                                           UUID pickupPointId,
                                           UUID timeFrameId,
                                           Date deliveryDate,
                                           OrderStatus orderStatus,
                                           String email,
                                           Boolean isPaid,
                                           DeliveryMethod deliveryMethod,
                                           int page,
                                           int limit) throws NoSuchOrderException, FirebaseAuthException, ResourceNotFoundException;

    List<OrderGroup> fetchOrderGroupsForPackageStaff(String staffEmail,
                                                     SortType deliverDateSortType,
                                                     LocalDate deliverDate,
                                                     Boolean getOldOrderGroup,
                                                     UUID timeFrameId,
                                                     UUID pickupPointId,
                                                     UUID delivererId,
                                                     Integer page,
                                                     Integer size) throws FirebaseAuthException, ResourceNotFoundException;

    Map<UUID, List<OrderProductForPackage>> getProductOrderDetailAfterPackaging(UUID supermarketId,
                                                                                UUID pickupPointId,
                                                                                String staffEmail,
                                                                                Integer page,
                                                                                Integer size) throws FirebaseAuthException, ResourceNotFoundException;


    OrderWithDetails fetchOrderDetail(UUID id) throws ResourceNotFoundException;

    Order createOrder(String jwtToken, OrderCreate orderCreate) throws Exception;

    String cancelOrder(String jwtToken, UUID id) throws ResourceNotFoundException, OrderCancellationNotAllowedException, FirebaseAuthException, IOException;

    String cancelPackageOrder(UUID id) throws ResourceNotFoundException, OrderCancellationNotAllowedException;

    String confirmPackaging(UUID orderId, String staffEmail, UUID productConsolidationAreaId) throws NoSuchOrderException, IOException, ResourceNotFoundException;

    String editProductConsolidationArea(UUID orderId, UUID productConsolidationAreaId) throws NoSuchOrderException, IOException, ResourceNotFoundException;

    String confirmPackagingGroup(UUID orderGroupId, String staffEmail, UUID productConsolidationAreaId) throws NoSuchOrderException, IOException, ResourceNotFoundException;

    String editProductConsolidationAreaGroup(UUID orderGroupId, UUID productConsolidationAreaId) throws NoSuchOrderException, IOException, ResourceNotFoundException;

    String confirmPackagedGroup(UUID orderGroupId, String staffEmail) throws NoSuchOrderException, IOException, ResourceNotFoundException;

    String confirmPackaged(UUID orderId, String staffEmail) throws NoSuchOrderException, IOException, ResourceNotFoundException;

    String confirmSucceeded(UUID orderId, String staffEmail) throws IOException, NoSuchOrderException, ResourceNotFoundException;

    String confirmFail(UUID orderId, String staffEmail) throws IOException, NoSuchOrderException, ResourceNotFoundException;

    String assignDeliverToOrderGroupOrBatch(UUID orderGroupId, UUID orderBatchId, UUID staffId) throws NoSuchOrderException, ConflictGroupAndBatchException, IOException, ResourceNotFoundException;

    String assignDeliverToOrder(UUID orderId, UUID staffId) throws NoSuchOrderException, ConflictGroupAndBatchException, IOException, ResourceNotFoundException;

    String deleteOrder(String jwtToken, UUID id) throws FirebaseAuthException, ResourceNotFoundException, OrderDeletionNotAllowedException;

    @Transactional
    String deleteOrderWithoutAuthen(UUID id) throws FirebaseAuthException, ResourceNotFoundException, OrderDeletionNotAllowedException;

    List<OrderBatch> batchingForStaff(Date deliverDate, UUID timeFrameId, Integer batchQuantity, UUID productConsolidationAreaId) throws ResourceNotFoundException;

    ShippingFeeDetailResponseBody getShippingFeeDetail(Double latitude, Double longitude, UUID pickupPoint) throws IOException, InterruptedException, ApiException;

    Order editDeliverDate(UUID orderId, Date deliverDate) throws ResourceNotFoundException;

    ReportOrdersResponse getReportOrders(OrderReportMode mode, LocalDate startDate, LocalDate endDate, Integer month, Integer year);

    List<OrderBatch> createBatches(List<OrderBatchCreateBody> orderBatchCreateBodyList);

    String printOrderPackaging(UUID orderId, String staffEmail) throws ResourceNotFoundException;

    DeliverManagerReport getDeliverManagerDailyReport(UUID deliverManagerId, LocalDate reportDate);

    DeliverManagerReport getDeliverManagerReport(UUID deliverManagerId, Integer year, Month month);
}
