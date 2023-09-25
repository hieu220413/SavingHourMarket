package com.fpt.capstone.savinghourmarket.service;

import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;
import java.util.UUID;

public interface TransactionService {
    String getPaymentUrl(Integer paidAmount, UUID orderId);

    RedirectView processPaymentResult(Map<String, String> allRequestParams);
}
