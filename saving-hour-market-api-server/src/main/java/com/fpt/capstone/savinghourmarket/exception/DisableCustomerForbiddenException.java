package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class DisableCustomerForbiddenException  extends ResponseStatusException {
    public DisableCustomerForbiddenException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
