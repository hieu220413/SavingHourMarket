package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.entity.OrderDetail;
import com.fpt.capstone.savinghourmarket.service.OrderDetailService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    @Override
    public List<OrderDetail> fetchOrderDetail(UUID id) {
        
        return null;
    }
}
