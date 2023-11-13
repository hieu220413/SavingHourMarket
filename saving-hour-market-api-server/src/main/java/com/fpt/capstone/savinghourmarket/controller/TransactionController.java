package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.Transaction;
import com.fpt.capstone.savinghourmarket.model.TransactionListResponseBody;
import com.fpt.capstone.savinghourmarket.service.TransactionService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final FirebaseAuth firebaseAuth;

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

    @RequestMapping(value = "/getTransactionForAdmin", method = RequestMethod.GET)
    public ResponseEntity<TransactionListResponseBody> getTransactionForAdmin(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit
            , @RequestParam(required = false) SortType timeSortType
            , @RequestParam(defaultValue = "2000-01-01T00:00:00") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDatetime
            , @RequestParam(defaultValue = "2100-01-01T00:00:00") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDatetime) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        TransactionListResponseBody transactionListResponseBody = transactionService.getTransactionForAdmin(timeSortType, fromDatetime, toDatetime, page, limit);
        return ResponseEntity.status(HttpStatus.OK).body(transactionListResponseBody);
    }

    @RequestMapping(value = "/refundTransaction", method = RequestMethod.PUT)
    public ResponseEntity<Transaction> refundTransaction(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam UUID transactionId) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Transaction transaction = transactionService.refundTransaction(transactionId);
        return ResponseEntity.status(HttpStatus.OK).body(transaction);
    }
}
