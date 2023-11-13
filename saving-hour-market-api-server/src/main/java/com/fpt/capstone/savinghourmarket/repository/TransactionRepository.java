package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    @Query("SELECT t FROM Transaction t " +
            "WHERE " +
            "t.paymentTime BETWEEN :fromDatetime AND :toDatetime " +
            "AND " +
            "(t.transactionNo IS NOT NULL)")

    Page<Transaction> getTransactionForAdmin(LocalDateTime fromDatetime, LocalDateTime toDatetime, Pageable pageableWithSort);
}
