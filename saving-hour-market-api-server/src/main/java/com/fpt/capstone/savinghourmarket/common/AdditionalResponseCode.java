package com.fpt.capstone.savinghourmarket.common;

public enum AdditionalResponseCode {
    REVOKED_ID_TOKEN(401),
    UNVERIFIED_EMAIL(403),
    EMAIL_ALREADY_EXISTS(403),
    DISCOUNT_NOT_FOUND(404),
    ORDER_NOT_FOUND(404);
    CUSTOMER_NOT_FOUND(404);
    private int code;

    AdditionalResponseCode(int code) {
        this.code = code;
    }

    public int getCode() {
        return this.code;
    }
}
