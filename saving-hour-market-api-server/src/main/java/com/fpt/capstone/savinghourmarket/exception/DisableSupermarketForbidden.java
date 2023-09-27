package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class DisableSupermarketForbidden extends ResponseStatusException {
    public DisableSupermarketForbidden(HttpStatusCode status, String message) {
        super(status, message);
    }
}
