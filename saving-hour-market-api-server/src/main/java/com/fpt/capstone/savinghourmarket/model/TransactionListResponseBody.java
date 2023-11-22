package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class TransactionListResponseBody {
    private List<TransactionWithOrderInfo> transactionList;
    private int totalPage;
    private long totalTransaction;
}
