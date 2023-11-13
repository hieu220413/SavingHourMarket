package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.Transaction;
import com.fpt.capstone.savinghourmarket.model.TransactionListResponseBody;
import org.springframework.web.servlet.view.RedirectView;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public interface TransactionService {
    String getPaymentUrl(Integer paidAmount, UUID orderId);

    RedirectView processPaymentResult(Map<String, String> allRequestParams);

    TransactionListResponseBody getTransactionForAdmin(SortType timeSortType, LocalDateTime fromDatetime, LocalDateTime toDatetime, Integer page, Integer limit);

    Transaction refundTransaction(UUID transactionId);
}
