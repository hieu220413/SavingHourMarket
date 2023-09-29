package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class RequiredEPaymentException extends ResponseStatusException {
    public RequiredEPaymentException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
