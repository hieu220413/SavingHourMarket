package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    Optional<Customer> findByEmail(String email);
    Optional<Customer> getCustomerByEmail (String email);

    Optional<Customer> findByPhoneAndFullName(String phone, String fullName);

    @Modifying
    @Query("delete from Customer c where c.email in ?1")
    void deleteCustomersWithIds(List<String> ids);
}
