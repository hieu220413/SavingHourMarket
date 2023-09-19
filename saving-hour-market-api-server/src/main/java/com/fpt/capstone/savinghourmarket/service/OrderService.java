package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderDetail;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.exception.BadRequestException;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    List<Order> fetchAll() throws NoSuchOrderException;

    List<Order> fetchByStatus(Integer status) throws NoSuchOrderException;


}
