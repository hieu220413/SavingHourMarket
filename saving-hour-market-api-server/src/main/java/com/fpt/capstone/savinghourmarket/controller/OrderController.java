package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderDetail;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.OrderCreate;
import com.fpt.capstone.savinghourmarket.model.OrderProduct;
import com.fpt.capstone.savinghourmarket.service.OrderGroupService;
import com.fpt.capstone.savinghourmarket.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/order/")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderGroupService orderGroupService;

    @GetMapping("/fetchAll")
    public ResponseEntity<List<Order>> getAll() throws NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchAll());
    }

    @GetMapping("/fetchAllNotInGroup")
    public ResponseEntity<List<Order>> getListOfOrdersNotInGroup() throws NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchAllNotInGroup());
    }

    @GetMapping("/fetchAllWithGroup")
    public ResponseEntity<List<OrderGroup>> getListOfOrdersWithGroup() throws NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderGroupService.fetchAll());
    }

    @GetMapping("/fetchByStatus")
    public ResponseEntity<List<Order>> getListOfOrdersByStatus(@RequestParam Integer status) throws NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchByStatus(status));
    }

    @GetMapping("/fetchOrderDetailById/{id}")
    public ResponseEntity<List<OrderProduct>> getOrderDetailById(@RequestParam UUID id) throws ResourceNotFoundException {
        Order order = orderService.fetchOrderDetail(id);
        List<OrderDetail> orderDetails = order.getOrderDetailList();

        List<OrderProduct> orderProducts = orderDetails.stream()
                .map(o -> {
                    OrderProduct orderProduct = new OrderProduct();
                    orderProduct.setId(o.getId());
                    orderProduct.setProductPrice(o.getProductPrice());
                    orderProduct.setProductOriginalPrice(o.getProductOriginalPrice());
                    orderProduct.setBoughtQuantity(o.getBoughtQuantity());

                    Product product = o.getProduct();
                    orderProduct.setName(product.getName());
                    orderProduct.setImageUrl(product.getImageUrl());
                    orderProduct.setDescription(product.getDescription());
                    orderProduct.setExpiredDate(product.getExpiredDate());
                    orderProduct.setProductSubCategory(product.getProductSubCategory().getName());
                    orderProduct.setSupermarketName(product.getSupermarket().getName());
                    orderProduct.setStatus(product.getStatus());
                    return orderProduct;

                })
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(orderProducts);
    }

    @GetMapping("/fetchCustomerOrderByStatus")
    public ResponseEntity<List<Order>> getCustomerOrderByStatus(@RequestHeader("Customer-email") String email, @RequestHeader(name = "Status", defaultValue = "4") Integer status) throws ResourceNotFoundException, NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchCustomerOrderByStatus(email, status));
    }

    @GetMapping("/fetchCustomerOrder")
    public ResponseEntity<List<Order>> getCustomerOrder(@RequestHeader("Customer-email") String email) throws ResourceNotFoundException, NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchCustomerOrder(email));
    }

    @PutMapping ("/createOrder")
    public ResponseEntity<Order> getCustomerOrder(@RequestBody OrderCreate order) throws ResourceNotFoundException, NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.createOrder(order));
    }

}
