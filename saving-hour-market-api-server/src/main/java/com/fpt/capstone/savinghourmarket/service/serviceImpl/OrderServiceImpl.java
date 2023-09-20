package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.exception.BadRequestException;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.repository.CustomerRepository;
import com.fpt.capstone.savinghourmarket.repository.OrderRepository;
import com.fpt.capstone.savinghourmarket.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository repository;

    @Autowired
    private CustomerRepository customerRepository;
    @Override
    public List<Order> fetchAllNotInGroup() throws NoSuchOrderException {
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

    @Override
    public Order fetchOrderDetail(UUID id) throws ResourceNotFoundException {
        return repository.findById(id).orElseThrow(()-> new ResourceNotFoundException("No order with id " + id));
    }

    @Override
    public List<Order> fetchAll() throws NoSuchOrderException {
        List<Order> orders = repository.findAll();
        if(orders.isEmpty()){
            throw new NoSuchOrderException("No order left");
        }
        return orders;
    }

    @Override
    public List<Order> fetchCustomerOrderByStatus(String email, Integer status) throws ResourceNotFoundException, NoSuchOrderException {
        Customer customer = customerRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("There is no customer with email "+email));
        List<Order> orders = repository.findOrderByCustomerAndStatus(customer,status);
        if(orders.isEmpty()){
            throw new NoSuchOrderException("No order left for this customer");
        }
        return orders;
    }

    @Override
    public List<Order> fetchCustomerOrder(String email) throws ResourceNotFoundException, NoSuchOrderException {
        Customer customer = customerRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("There is no customer with email "+email));
        List<Order> orders = repository.findOrderByCustomer(customer);
        if(orders.isEmpty()){
            throw new NoSuchOrderException("No order left for this customer");
        }
        return orders;
    }

    @Override
    public Order createOrder(Order order) {

        return null;
    }
}
