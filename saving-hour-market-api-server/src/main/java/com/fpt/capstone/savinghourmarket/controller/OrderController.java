package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderDetail;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.service.OrderDetailService;
import com.fpt.capstone.savinghourmarket.service.OrderGroupService;
import com.fpt.capstone.savinghourmarket.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/order/")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderGroupService orderGroupService;

    @Autowired
    private OrderDetailService orderDetailService;

    @GetMapping("/fetchAllNotInGroup")
    public ResponseEntity<List<Order>> getListOfOrders() throws NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchAll());
    }

    @GetMapping("/fetchAllWithGroup")
    public ResponseEntity<List<OrderGroup>> getListOfOrdersWithGroup() throws NoSuchOrderException {
        return ResponseEntity.status(HttpStatus.OK).body(orderGroupService.fetchAll());
    }

    @GetMapping("/fetchByStatus")
    public ResponseEntity<List<Order>> getListOfOrdersByStatus(@RequestParam Integer status) throws NoSuchOrderException{
        return ResponseEntity.status(HttpStatus.OK).body(orderService.fetchByStatus(status));
    }

    @GetMapping("/fetchOrderDetailById/{id}")
    public ResponseEntity<List<OrderDetail>> getOrderDetailById(@RequestParam UUID id) throws ResourceNotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(orderDetailService.fetchOrderDetail(id));
    }

}
