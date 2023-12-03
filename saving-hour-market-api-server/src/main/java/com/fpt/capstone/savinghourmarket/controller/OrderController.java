package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.*;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderBatch;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.exception.*;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.service.FirebaseService;
import com.fpt.capstone.savinghourmarket.service.OrderService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.maps.errors.ApiException;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/order/")
@RequiredArgsConstructor
@Validated
public class OrderController {

    private final OrderService orderService;

    private final FirebaseAuth firebaseAuth;

    @GetMapping("/getOrdersForCustomer")
    public ResponseEntity<List<Order>> getOrdersForCustomer(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                            @RequestParam(required = false) SortType totalPriceSortType,
                                                            @RequestParam(required = false) SortType createdTimeSortType,
                                                            @RequestParam(required = false) SortType deliveryDateSortType,
                                                            @RequestParam(required = false) OrderStatus orderStatus,
                                                            @RequestParam(required = false) Boolean isPaid,
                                                            @RequestParam(defaultValue = "0") Integer page,
                                                            @RequestParam(defaultValue = "999") Integer size)
            throws FirebaseAuthException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrdersForCustomer(jwtToken,
                totalPriceSortType == null ? null : totalPriceSortType.name(),
                createdTimeSortType == null ? null : createdTimeSortType.name(),
                deliveryDateSortType == null ? null : deliveryDateSortType.name(),
                orderStatus,
                isPaid,
                page,
                size));
    }

    @GetMapping("/staff/getOrders")
    public ResponseEntity<List<Order>> getOrdersForStaff(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                         @RequestParam(required = false) SortType totalPriceSortType,
                                                         @RequestParam(required = false) SortType createdTimeSortType,
                                                         @RequestParam(required = false) SortType deliveryDateSortType,
                                                         @RequestParam(required = false, defaultValue = "false") Boolean getOldOrder,
                                                         @RequestParam(required = false) Date deliveryDate,
                                                         @RequestParam(required = false) OrderStatus orderStatus,
                                                         @RequestParam(required = false) UUID timeFrameId,
                                                         @RequestParam(required = false) UUID packagerId,
                                                         @RequestParam(required = false) UUID delivererId,
                                                         @RequestParam(required = false) Boolean isPaid,
                                                         @RequestParam(required = false) Boolean isGrouped,
                                                         @RequestParam(required = false) Boolean isBatched,
                                                         @RequestParam(defaultValue = "0") Integer page,
                                                         @RequestParam(defaultValue = "9999") Integer size) throws FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrdersForStaff(
                staffEmail,
                timeFrameId,
                totalPriceSortType == null ? null : totalPriceSortType.name(),
                createdTimeSortType == null ? null : createdTimeSortType.name(),
                deliveryDateSortType == null ? null : deliveryDateSortType.name(),
                getOldOrder,
                deliveryDate,
                orderStatus,
                packagerId,
                delivererId,
                isPaid,
                isGrouped,
                isBatched,
                page,
                size)
        );
    }

    @GetMapping("/packageStaff/getOrders")
    public ResponseEntity<List<Order>> getOrdersForPackageStaff(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                                @RequestParam(required = false) SortType totalPriceSortType,
                                                                @RequestParam(required = false) SortType createdTimeSortType,
                                                                @RequestParam(required = false) SortType deliveryDateSortType,
                                                                @RequestParam(required = false, defaultValue = "false") Boolean getOldOrder,
                                                                @RequestParam(required = false) UUID pickupPointId,
                                                                @RequestParam(required = false) UUID timeFrameId,
                                                                @RequestParam(required = false) Date deliveryDate,
                                                                @RequestParam(required = false) OrderStatus orderStatus,
                                                                @RequestParam(required = false) Boolean isPaid,
                                                                @RequestParam() DeliveryMethod deliveryMethod,
                                                                @RequestParam(defaultValue = "0") Integer page,
                                                                @RequestParam(defaultValue = "9999") Integer size) throws ResourceNotFoundException, NoSuchOrderException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrdersForPackageStaff(
                totalPriceSortType == null ? null : totalPriceSortType.name(),
                createdTimeSortType == null ? null : createdTimeSortType.name(),
                deliveryDateSortType == null ? null : deliveryDateSortType.name(),
                getOldOrder,
                pickupPointId,
                timeFrameId,
                deliveryDate,
                orderStatus,
                staffEmail,
                isPaid,
                deliveryMethod,
                page,
                size)
        );
    }

    @GetMapping("/packageStaff/getOrderGroup")
    public ResponseEntity<List<OrderGroup>> getOrderGroupForPackageStaff(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                                         @RequestParam(required = false) SortType deliverDateSortType,
                                                                         @RequestParam(required = false) LocalDate deliverDate,
                                                                         @RequestParam(required = false, defaultValue = "false") Boolean getOldOrderGroup,
                                                                         @RequestParam(required = false) UUID timeFrameId,
                                                                         @RequestParam(required = false) UUID pickupPointId,
                                                                         @RequestParam(required = false) UUID delivererId,
                                                                         @RequestParam(defaultValue = "0") Integer page,
                                                                         @RequestParam(defaultValue = "9999") Integer size) throws FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrderGroupsForPackageStaff(staffEmail, deliverDateSortType, deliverDate, getOldOrderGroup, timeFrameId, pickupPointId, delivererId, page, size));
    }

    @GetMapping("/staff/getOrderGroup")
    public ResponseEntity<OrderGroupPageResponse> getOrderGroupForStaff(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                                        @RequestParam(required = false) SortType deliverDateSortType,
                                                                        @RequestParam(required = false) LocalDate deliverDate,
                                                                        @RequestParam(required = false, defaultValue = "false") Boolean getOldOrderGroup,
                                                                        @RequestParam(required = false) OrderStatus status,
                                                                        @RequestParam(required = false) UUID timeFrameId,
                                                                        @RequestParam(required = false) UUID pickupPointId,
                                                                        @RequestParam(required = false) UUID delivererId,
                                                                        @RequestParam(defaultValue = "0") Integer page,
                                                                        @RequestParam(defaultValue = "9999") Integer size) throws FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrderGroups(staffEmail, status, deliverDateSortType, deliverDate, getOldOrderGroup, timeFrameId, pickupPointId, delivererId, page, size));
    }

    @GetMapping("/staff/getOrderBatch")
    public ResponseEntity<List<OrderBatch>> getOrderBatchForStaff(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
//                                                                  @RequestParam(required = false) District district,
                                                                  @RequestParam(required = false, defaultValue = "false") Boolean getOldOrderBatch,
                                                                  @RequestParam(required = false) OrderStatus status,
                                                                  @RequestParam(required = false) SortType deliverDateSortType,
                                                                  @RequestParam(required = false) LocalDate deliveryDate,
                                                                  @RequestParam(required = false) UUID timeFrameId,
                                                                  @RequestParam(required = false) UUID delivererId) throws NoSuchOrderException, FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrderBatches(staffEmail, timeFrameId, status != null ? status.ordinal() : null, getOldOrderBatch, deliverDateSortType, deliveryDate, delivererId));
    }

    @GetMapping("/getOrderDetail/{id}")
    public ResponseEntity<OrderWithDetails> getOrderDetail(@PathVariable UUID id) throws ResourceNotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrderDetail(id));
    }

    @GetMapping("/packageStaff/getProductsOrderAfterPackaging")
    public ResponseEntity<Map<UUID, List<OrderProductForPackage>>> getProductsOrderAfterPackaging(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                                                                  @RequestParam(required = false) UUID supermarketId,
                                                                                                  @RequestParam(required = false) UUID pickupPointId,
                                                                                                  @RequestParam(defaultValue = "0") Integer page,
                                                                                                  @RequestParam(defaultValue = "9999") Integer size) throws ResourceNotFoundException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getProductOrderDetailAfterPackaging(supermarketId, pickupPointId, staffEmail, page, size));
    }


    @PutMapping("/createOrder")
    public ResponseEntity<Order> createOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken, @Valid @RequestBody OrderCreate order) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.createOrder(jwtToken, order));
    }

    @PutMapping("/cancelOrder/{id}")
    public ResponseEntity<String> cancelOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken, @PathVariable UUID id) throws ResourceNotFoundException, OrderCancellationNotAllowedException, FirebaseAuthException, IOException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.cancelOrder(jwtToken, id));
    }

    @DeleteMapping("/deleteOrder/{id}")
    public ResponseEntity<String> deleteOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken, @PathVariable UUID id) throws ResourceNotFoundException, FirebaseAuthException, OrderDeletionNotAllowedException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.deleteOrder(jwtToken, id));
    }

    @PutMapping("/packageStaff/confirmPackaging")
    public ResponseEntity<String> confirmPackaging(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                   @RequestParam UUID orderId, @RequestParam UUID productConsolidationAreaId) throws NoSuchOrderException, IOException, FirebaseAuthException, ResourceNotFoundException, InterruptedException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.confirmPackaging(orderId, staffEmail, productConsolidationAreaId));
    }

    @PutMapping("/packageStaff/cancelOrder/{id}")
    public ResponseEntity<String> cancelPackageOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken, @PathVariable UUID id) throws ResourceNotFoundException, OrderCancellationNotAllowedException, FirebaseAuthException, IOException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.cancelPackageOrder(id, staffEmail));
    }

    @PutMapping("/packageStaff/editProductConsolidationArea")
    public ResponseEntity<String> editProductConsolidationArea(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                               @RequestParam UUID orderId, @RequestParam UUID productConsolidationAreaId) throws NoSuchOrderException, IOException, FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.editProductConsolidationArea(orderId, productConsolidationAreaId));
    }

    @PutMapping("/packageStaff/confirmPackagingGroup")
    public ResponseEntity<String> confirmPackagingGroup(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                        @RequestParam UUID orderGroupId,
                                                        @RequestParam(required = false) UUID productConsolidationAreaId) throws NoSuchOrderException, IOException, FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.confirmPackagingGroup(orderGroupId, staffEmail, productConsolidationAreaId));
    }

    @PutMapping("/packageStaff/editProductConsolidationAreaGroup")
    public ResponseEntity<String> editProductConsolidationAreaGroup(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                                    @RequestParam UUID orderGroupId, @RequestParam UUID productConsolidationAreaId) throws NoSuchOrderException, IOException, FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.editProductConsolidationAreaGroup(orderGroupId, productConsolidationAreaId));
    }

    @PutMapping("/packageStaff/confirmPackaged")
    public ResponseEntity<String> confirmPackaged(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                  @RequestParam UUID orderId) throws NoSuchOrderException, IOException, FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.confirmPackaged(orderId, staffEmail));
    }

    @PutMapping("/packageStaff/confirmPackagedGroup")
    public ResponseEntity<String> confirmPackagedGroup(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                       @RequestParam UUID orderGroupId) throws NoSuchOrderException, IOException, FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.confirmPackagedGroup(orderGroupId, staffEmail));
    }

    @PutMapping("/packageStaff/printOrderPackaging")
    public ResponseEntity<String> printOrderPackaging(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                      @RequestParam UUID orderId) throws FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.printOrderPackaging(orderId, staffEmail));
    }

    @PutMapping("/deliveryStaff/confirmSucceeded")
    public ResponseEntity<String> confirmSucceeded(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                   @RequestParam UUID orderId) throws NoSuchOrderException, IOException, FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.confirmSucceeded(orderId, staffEmail));
    }

    @PutMapping("/deliveryStaff/confirmFail")
    public ResponseEntity<String> confirmFail(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                              @RequestParam UUID orderId) throws NoSuchOrderException, IOException, FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.confirmFail(orderId, staffEmail));
    }

    @PutMapping("/deliveryManager/assignDeliveryStaffToGroupOrBatch")
    public ResponseEntity<String> assignDeliveryStaffToGroupOrBatch(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                                    @RequestParam(required = false) UUID orderGroupId,
                                                                    @RequestParam(required = false) UUID orderBatchId,
                                                                    @RequestParam UUID staffId) throws NoSuchOrderException, ConflictGroupAndBatchException, IOException, FirebaseAuthException, ResourceNotFoundException, InterruptedException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String emailManager = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.assignDeliverToOrderGroupOrBatch(emailManager, orderGroupId, orderBatchId, staffId));
    }

    @PutMapping("/deliveryManager/assignDeliveryStaffToOrder")
    public ResponseEntity<String> assignDeliveryStaffToOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                             @RequestParam(required = false) UUID orderId,
                                                             @RequestParam UUID staffId) throws NoSuchOrderException, ConflictGroupAndBatchException, IOException, FirebaseAuthException, ResourceNotFoundException, InterruptedException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String emailManager = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.assignDeliverToOrder(emailManager, orderId, staffId));
    }

    @GetMapping("/deliveryManager/getDailyReport")
    public ResponseEntity<DeliverManagerReport> getDeliverManagerDailyReport(
            @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
            @RequestParam UUID deliverManagerId,
            @RequestParam LocalDate reportDate) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getDeliverManagerDailyReport(deliverManagerId, reportDate));
    }

    @GetMapping("/deliveryManager/getReport")
    public ResponseEntity<DeliverManagerReport> getDeliverManagerReport(
            @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Month month,
            @RequestParam UUID deliverManagerId) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getDeliverManagerReport(deliverManagerId, year, month));
    }


    @GetMapping("/getShippingFeeDetail")
    public ResponseEntity<ShippingFeeDetailResponseBody> getShippingFeeDetail(
            @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam UUID pickupPointId
    ) throws FirebaseAuthException, IOException, InterruptedException, ApiException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ShippingFeeDetailResponseBody shippingFeeDetailResponseBody = orderService.getShippingFeeDetail(latitude, longitude, pickupPointId);
        return ResponseEntity.status(HttpStatus.OK).body(shippingFeeDetailResponseBody);
    }

    @PostMapping("/sendNotification")
    public ResponseEntity<String> sendNotification(@RequestParam String title, @RequestParam String message, @RequestParam String topic) throws IOException {
        FirebaseService.sendPushNotification(title, message, topic);
        return ResponseEntity.status(HttpStatus.OK).body("OK");
    }

    @GetMapping("/deliveryManager/batchingForStaff")
    public ResponseEntity<List<OrderBatch>> batchingForStaff(
            @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @RequestParam Date deliverDate,
            @RequestParam UUID timeFrameId,
            @RequestParam UUID productConsolidationAreaId,
            @RequestParam Integer batchQuantity) throws ResourceNotFoundException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.batchingForStaff(deliverDate, timeFrameId, batchQuantity, productConsolidationAreaId));
    }

    @PostMapping("/deliveryManager/createBatches")
    public ResponseEntity<List<OrderBatch>> createBatches(
            @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @RequestBody List<@jakarta.validation.Valid OrderBatchCreateBody> orderBatchCreateBodyList) throws ResourceNotFoundException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.createBatches(orderBatchCreateBodyList));
    }


    @PutMapping("/deliveryStaff/editDeliverDate/{orderId}")
    public ResponseEntity<Order> editDeliverDate(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
                                                 @PathVariable UUID orderId,
                                                 @RequestParam Date deliverDate) throws ResourceNotFoundException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.editDeliverDate(orderId, deliverDate));
    }

    @GetMapping("/packageStaff/getReportOrders")
    public ResponseEntity<ReportOrdersResponse> getReportOrders(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
                                                                OrderReportMode mode,
                                                                @RequestParam(required = false) LocalDate startDate,
                                                                @RequestParam(required = false) LocalDate endDate,
                                                                @RequestParam(required = false) Integer month,
                                                                @RequestParam(required = false) Integer year) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getReportOrders(mode, startDate, endDate, month, year));
    }

}
