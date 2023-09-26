package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.service.TransactionService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @RequestMapping(value = "/getPaymentUrl", method = RequestMethod.GET)
    public ResponseEntity<String> getPaymentUrl(@Min(1000) @RequestParam Integer paidAmount, @RequestParam UUID orderId) {
        String paymentUrl = transactionService.getPaymentUrl(paidAmount, orderId);
        return ResponseEntity.status(HttpStatus.OK).body(paymentUrl);
    }

    @RequestMapping(value = "/processPaymentResult", method = RequestMethod.GET)
    public RedirectView processPaymentResult(@RequestParam Map<String,String> allRequestParams) {
        RedirectView result = transactionService.processPaymentResult(allRequestParams);
        return result;
    }

}
