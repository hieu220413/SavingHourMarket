package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.exception.*;
import com.fpt.capstone.savinghourmarket.model.OrderCreate;
import com.fpt.capstone.savinghourmarket.model.OrderProduct;
import com.fpt.capstone.savinghourmarket.service.OrderService;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/order/")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/getAll")
    public ResponseEntity<List<Order>> getAll() throws NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchAll());
    }

    @GetMapping("/getOrdersToSpecificLocations")
    public ResponseEntity<List<Order>> getListOfOrdersNotInGroup() throws NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchAllNotInGroup());
    }

    @GetMapping("/getOrderGroup")
    public ResponseEntity<List<OrderGroup>> getListOfOrdersWithGroup() throws NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchAllWithGroup());
    }

    @GetMapping("/getOrdersByStatus")
    public ResponseEntity<List<Order>> getListOfOrdersByStatus(@RequestParam Integer status) throws NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchByStatus(status));
    }


    @GetMapping("/getCustomerOrders")
    public ResponseEntity<List<Order>> getCustomerOrderByStatus(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestHeader(name = "Status", defaultValue = "4") Integer status) throws ResourceNotFoundException, NoSuchOrderException, FirebaseAuthException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchCustomerOrders(jwtToken, status));
    }

    @GetMapping("/getOrderDetail/{id}")
    public ResponseEntity<List<OrderProduct>> getOrderDetailById(@PathVariable UUID id) throws ResourceNotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrderDetail(id));
    }

    @GetMapping("/getOrderForStaff")
    public ResponseEntity<List<Order>> getOrderForStaff(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                        @RequestParam(required = false) SortType totalPriceSortType,
                                                        @RequestParam(required = false) SortType createdTimeSortType,
                                                        @RequestParam(required = false) SortType deliveryDateSortType,
                                                        @RequestParam(required = false) OrderStatus orderStatus,
                                                        @RequestParam(required = false) UUID packagerId,
                                                        @RequestParam(required = false) Boolean isPaid,
                                                        @RequestParam(required = false) Boolean isGrouped,
                                                        @RequestParam(defaultValue = "0")  Integer page,
                                                        @RequestParam(defaultValue = "10") Integer limit) throws ResourceNotFoundException, NoSuchOrderException, FirebaseAuthException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchOrdersForStaff(jwtToken,
                totalPriceSortType == null ? null : totalPriceSortType.name(),
                createdTimeSortType == null ? null : createdTimeSortType.name(),
                deliveryDateSortType == null ? null : deliveryDateSortType.name(),
                orderStatus,
                packagerId,
                isPaid,
                isGrouped,
                page,
                limit));
    }

    @Transactional
    @PutMapping("/createOrder")
    public ResponseEntity<String> getCustomerOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestBody OrderCreate order) throws ResourceNotFoundException, FirebaseAuthException, IOException, OutOfProductQuantityException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.createOrder(jwtToken, order));
    }

    @PutMapping("/cancelOrder/{id}")
    public ResponseEntity<String> cancelOrder(@PathVariable UUID id) throws ResourceNotFoundException, OrderCancellationNotAllowedException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.cancelOrder(id));
    }

}
