package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.Transaction;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TransactionWithOrderInfo {

    public TransactionWithOrderInfo(Transaction transaction) {
        this.id = transaction.getId();
        this.paymentMethod = transaction.getPaymentMethod();
        this.paymentTime = transaction.getPaymentTime();
        this.amountOfMoney = transaction.getAmountOfMoney();
        this.transactionNo = transaction.getTransactionNo();
        this.order = new OrderWithDetailAndCustomer(transaction.getOrder());
        this.refundTransaction = transaction.getRefundTransaction();
    }

    private UUID id;

    private Integer paymentMethod;

    private LocalDateTime paymentTime;

    private Integer amountOfMoney;

    private String transactionNo;

    private OrderWithDetailAndCustomer order;

    private Transaction refundTransaction;
}
