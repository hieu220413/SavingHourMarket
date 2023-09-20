package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashMap;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApiError {
    public ApiError(String timestamp, int code, String message) {
        this.timestamp = timestamp;
        this.code = code;
        this.message = message;
    }

    private String timestamp;
    private int code;
    private String message;
    private HashMap errorFields;

}
