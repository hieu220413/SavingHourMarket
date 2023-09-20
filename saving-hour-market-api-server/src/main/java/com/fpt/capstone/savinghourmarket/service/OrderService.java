package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.OrderCreate;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    List<Order> fetchAllNotInGroup() throws NoSuchOrderException;

    List<Order> fetchByStatus(Integer status) throws NoSuchOrderException;

    Order fetchOrderDetail(UUID id) throws ResourceNotFoundException;

    List<Order> fetchAll() throws NoSuchOrderException;

    List<Order> fetchCustomerOrderByStatus(String customerEmail, Integer status) throws ResourceNotFoundException, NoSuchOrderException;

    List<Order> fetchCustomerOrder(String customerEmail) throws ResourceNotFoundException, NoSuchOrderException;

    Order createOrder(OrderCreate order);
}
