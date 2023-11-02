package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class DeleteSuperMarketAddressForbiddenException extends ResponseStatusException {
    public DeleteSuperMarketAddressForbiddenException(HttpStatusCode status, String message) {
        super(status, message);
    }

}
