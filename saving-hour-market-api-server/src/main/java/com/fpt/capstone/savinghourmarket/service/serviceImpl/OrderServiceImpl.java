package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.exception.BadRequestException;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
import com.fpt.capstone.savinghourmarket.repository.OrderRepository;
import com.fpt.capstone.savinghourmarket.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository repository;
    @Override
    public List<Order> fetchAll() throws NoSuchOrderException {
        List<Order> orderList =repository.findOrderByOrderGroupIsNull();
        if(orderList.isEmpty()){
            throw new NoSuchOrderException("No order left on the system");
        }
        return orderList;
    }

    @Override
    public List<Order> fetchByStatus(Integer status) throws NoSuchOrderException {
        List<Order> orders = repository.findOrderByStatus(status);
        if(orders.isEmpty()){
            throw new NoSuchOrderException("No such order with status" + status);
        }
        return orders;
    }
}
