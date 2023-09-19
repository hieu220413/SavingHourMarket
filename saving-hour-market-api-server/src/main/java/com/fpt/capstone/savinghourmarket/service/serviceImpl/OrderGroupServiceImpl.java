package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
import com.fpt.capstone.savinghourmarket.repository.OrderGroupRepository;
import com.fpt.capstone.savinghourmarket.service.OrderGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderGroupServiceImpl implements OrderGroupService {

    @Autowired
    private OrderGroupRepository repository;
    @Override
    public List<OrderGroup> fetchAll() throws NoSuchOrderException {
        List<OrderGroup> orderGroups = repository.findAll();
        if(orderGroups.isEmpty()){
            throw new NoSuchOrderException("No such order group left on system");
        }
        return orderGroups;
    }
}
