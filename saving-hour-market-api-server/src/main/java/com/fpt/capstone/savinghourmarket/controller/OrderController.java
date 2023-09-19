package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
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

@RestController
@RequestMapping(value = "/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderGroupService orderGroupService;
    @GetMapping("/fetchAllNotInGroup")
    public ResponseEntity<List<Order>> getListOfOrders() throws NoSuchOrderException {
        List<Order> orders = orderService.fetchAll();;
        return ResponseEntity.status(HttpStatus.OK).body(orders);
    }

    @GetMapping("/fetchAllWithGroup")
    public ResponseEntity<List<OrderGroup>> getListOfOrdersWithGroup() throws NoSuchOrderException {
        List<OrderGroup> orderGroups = orderGroupService.fetchAll();
        return ResponseEntity.status(HttpStatus.OK).body(orderGroups);
    }

    @GetMapping("/fetchByStatus")
    public ResponseEntity<List<Order>> getListOfOrdersByStatus(@RequestParam Integer status) throws NoSuchOrderException{
        List<Order> ordersByStatus = orderService.fetchByStatus(status);
        return ResponseEntity.status(HttpStatus.OK).body(ordersByStatus);
    }
}
