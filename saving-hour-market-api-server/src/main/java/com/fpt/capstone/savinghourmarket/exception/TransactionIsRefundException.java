package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class TransactionIsRefundException extends ResponseStatusException {
    public TransactionIsRefundException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
