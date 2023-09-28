package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class OrderIsPaidException extends ResponseStatusException {
    public OrderIsPaidException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
