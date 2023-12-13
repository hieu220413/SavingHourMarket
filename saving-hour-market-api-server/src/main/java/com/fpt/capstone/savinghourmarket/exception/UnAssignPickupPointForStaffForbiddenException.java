package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class UnAssignPickupPointForStaffForbiddenException extends ResponseStatusException {
    public UnAssignPickupPointForStaffForbiddenException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
