package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findOrderByOrderGroupIsNull();

    List<Order> findOrderByStatus(Integer status);

    @Query("SELECT o FROM Order o " +
            "WHERE (:status IS NULL OR o.status = :status ) " +
            "AND o.customer = :customer")
    List<Order> findOrderByCustomerAndStatus(@Param("customer") Customer customer,@Param("status") Integer status);
}
