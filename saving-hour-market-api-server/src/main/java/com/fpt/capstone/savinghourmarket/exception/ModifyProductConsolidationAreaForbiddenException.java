package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class ModifyProductConsolidationAreaForbiddenException extends ResponseStatusException {
    public ModifyProductConsolidationAreaForbiddenException(HttpStatusCode status, String message) {
        super(status, message);
    }

}
