package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class ModifyPickupPointForbiddenException extends ResponseStatusException {
    public ModifyPickupPointForbiddenException(HttpStatusCode status, String message) {
        super(status, message);
    }

}