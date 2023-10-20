package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class DisableStaffForbiddenException extends ResponseStatusException {
    public DisableStaffForbiddenException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
