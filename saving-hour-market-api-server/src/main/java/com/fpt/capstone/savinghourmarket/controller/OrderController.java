package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.District;
import com.fpt.capstone.savinghourmarket.common.OrderReportMode;
import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.common.SortType;
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
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
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
                                                            @RequestParam(defaultValue = "10") Integer size)
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
                                                         @RequestParam(required = false) Date deliveryDate,
                                                         @RequestParam(required = false) OrderStatus orderStatus,
                                                         @RequestParam(required = false) UUID packagerId,
                                                         @RequestParam(required = false) UUID delivererId,
                                                         @RequestParam(required = false) Boolean isPaid,
                                                         @RequestParam(required = false) Boolean isGrouped,
                                                         @RequestParam(defaultValue = "0") Integer page,
                                                         @RequestParam(defaultValue = "10") Integer size) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrdersForStaff(
                totalPriceSortType == null ? null : totalPriceSortType.name(),
                createdTimeSortType == null ? null : createdTimeSortType.name(),
                deliveryDateSortType == null ? null : deliveryDateSortType.name(),
                deliveryDate,
                orderStatus,
                packagerId,
                delivererId,
                isPaid,
                isGrouped,
                page,
                size)
        );
    }

    @GetMapping("/staff/getOrdersForPackageStaff")
    public ResponseEntity<List<Order>> getOrdersForPackageStaff(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                                @RequestParam(required = false) SortType totalPriceSortType,
                                                                @RequestParam(required = false) SortType createdTimeSortType,
                                                                @RequestParam(required = false) SortType deliveryDateSortType,
                                                                @RequestParam(required = false) UUID pickupPointId,
                                                                @RequestParam(required = false) Date deliveryDate,
                                                                @RequestParam(required = false) OrderStatus orderStatus,
                                                                @RequestParam(required = false) Boolean isPaid,
                                                                @RequestParam(required = false) Boolean isGrouped,
                                                                @RequestParam(defaultValue = "0") Integer page,
                                                                @RequestParam(defaultValue = "10") Integer size) throws ResourceNotFoundException, NoSuchOrderException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String staffEmail = Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrdersForPackageStaff(
                totalPriceSortType == null ? null : totalPriceSortType.name(),
                createdTimeSortType == null ? null : createdTimeSortType.name(),
                deliveryDateSortType == null ? null : deliveryDateSortType.name(),
                pickupPointId,
                deliveryDate,
                orderStatus,
                staffEmail,
                isPaid,
                isGrouped,
                page,
                size)
        );
    }

    @GetMapping("/staff/getOrderGroup")
    public ResponseEntity<List<OrderGroup>> getOrderGroupForStaff(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                                  @RequestParam(required = false) LocalDate deliverDate,
                                                                  @RequestParam(required = false) UUID timeFrameId,
                                                                  @RequestParam(required = false) UUID pickupPointId,
                                                                  @RequestParam(required = false) UUID delivererId) throws NoSuchOrderException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrderGroups(deliverDate, timeFrameId, pickupPointId, delivererId));
    }

    @GetMapping("/staff/getOrderBatch")
    public ResponseEntity<List<OrderBatch>> getOrderBatchForStaff(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
//                                                                  @RequestParam(required = false) District district,
                                                                  @RequestParam(required = false) LocalDate deliveryDate,
                                                                  @RequestParam(required = false) UUID delivererId) throws NoSuchOrderException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrderBatches(deliveryDate, delivererId));
    }

    @GetMapping("/getOrderDetail/{id}")
    public ResponseEntity<OrderWithDetails> getOrderDetail(@PathVariable UUID id) throws ResourceNotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrderDetail(id));
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

    @PutMapping("/staff/confirmPackaging")
    public ResponseEntity<String> confirmPackaging(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                   @RequestParam UUID orderId, @RequestParam UUID staffId) throws NoSuchOrderException, IOException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.confirmPackaging(orderId, staffId));
    }

    @PutMapping("/staff/confirmPackaged")
    public ResponseEntity<String> confirmPackaged(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                  @RequestParam UUID orderId, @RequestParam UUID staffId) throws NoSuchOrderException, IOException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.confirmPackaged(orderId, staffId));
    }

    @PutMapping("/staff/confirmSucceeded")
    public ResponseEntity<String> confirmSucceeded(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                   @RequestParam UUID orderId, @RequestParam UUID staffId) throws NoSuchOrderException, IOException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.confirmSucceeded(orderId, staffId));
    }

    @PutMapping("/staff/confirmFail")
    public ResponseEntity<String> confirmFail(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                              @RequestParam UUID orderId, @RequestParam UUID staffId) throws NoSuchOrderException, IOException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.confirmFail(orderId, staffId));
    }

    @PutMapping("/staff/deliveryManager/assignDeliveryStaffToGroupOrBatch")
    public ResponseEntity<String> assignDeliveryStaffToGroupOrBatch(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                                    @RequestParam(required = false) UUID orderGroupId,
                                                                    @RequestParam(required = false) UUID orderBatchId,
                                                                    @RequestParam UUID staffId) throws NoSuchOrderException, ConflictGroupAndBatchException, IOException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.assignDeliverToOrderGroupOrBatch(orderGroupId, orderBatchId, staffId));
    }

    @PutMapping("/staff/deliveryManager/assignDeliveryStaffToOrder")
    public ResponseEntity<String> assignDeliveryStaffToOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                             @RequestParam(required = false) UUID orderId,
                                                             @RequestParam UUID staffId) throws NoSuchOrderException, ConflictGroupAndBatchException, IOException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.assignDeliverToOrder(orderId, staffId));
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

    @GetMapping("/staff/deliveryManager/batchingForStaff")
    public ResponseEntity<List<OrderBatch>> batchingForStaff(
            @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @RequestParam Date deliverDate, @RequestParam UUID timeFrameId,
            @RequestParam Integer batchQuantity) throws ResourceNotFoundException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.batchingForStaff(deliverDate, timeFrameId, batchQuantity));
    }

    @PostMapping("/staff/deliveryManager/createBatches")
    public ResponseEntity<List<OrderBatch>> createBatches(
            @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @RequestBody List<@jakarta.validation.Valid OrderBatchCreateBody> orderBatchCreateBodyList) throws ResourceNotFoundException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.createBatches(orderBatchCreateBodyList));
    }


    @PutMapping("/staff/editDeliverDate/{orderId}")
    public ResponseEntity<Order> editDeliverDate(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
                                                 @PathVariable UUID orderId,
                                                 @RequestParam Date deliverDate) throws ResourceNotFoundException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.editDeliverDate(orderId, deliverDate));
    }

    @PutMapping("/staff/chooseConsolidationArea/{orderId}")
    public ResponseEntity<Order> chooseConsolidationArea(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
                                                         @PathVariable UUID orderId,
                                                         @RequestParam UUID consolidationAreaId) throws ResourceNotFoundException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.chooseConsolidationArea(orderId, consolidationAreaId));
    }

    @GetMapping("/staff/getReportOrders")
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
