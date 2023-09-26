package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
import com.fpt.capstone.savinghourmarket.exception.OrderCancellationNotAllowedException;
import com.fpt.capstone.savinghourmarket.exception.OutOfProductQuantityException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.OrderCreate;
import com.fpt.capstone.savinghourmarket.model.OrderProduct;
import com.google.firebase.auth.FirebaseAuthException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    List<Order> fetchAll() throws NoSuchOrderException;
    List<Order> fetchAllNotInGroup() throws NoSuchOrderException;
    List<OrderGroup> fetchAllWithGroup() throws NoSuchOrderException;
    List<Order> fetchByStatus(Integer status) throws NoSuchOrderException;
    List<Order> fetchCustomerOrders(String jwtToken, Integer status) throws ResourceNotFoundException, NoSuchOrderException, FirebaseAuthException;
    List<OrderProduct> fetchOrderDetail(UUID id) throws ResourceNotFoundException;
    String createOrder(String jwtToken, OrderCreate orderCreate) throws ResourceNotFoundException, IOException, FirebaseAuthException, OutOfProductQuantityException;
    String cancelOrder(UUID id) throws ResourceNotFoundException, OrderCancellationNotAllowedException;
}
