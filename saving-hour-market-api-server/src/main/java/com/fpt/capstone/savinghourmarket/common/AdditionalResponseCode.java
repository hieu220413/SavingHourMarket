package com.fpt.capstone.savinghourmarket.common;

public enum AdditionalResponseCode {
    REVOKED_ID_TOKEN(401),
    UNVERIFIED_EMAIL(403),
    EMAIL_ALREADY_EXISTS(403),
    STAFF_ACCESS_FORBIDDEN(403),
    STAFF_NOT_FOUND(404),
    DISCOUNT_NOT_FOUND(404),
    ORDER_NOT_FOUND(404),
    CUSTOMER_HAVING_PROCESSING_ORDER(403),
    CUSTOMER_NOT_FOUND(404),
    DISABLE_SUPERMARKET_FORBIDDEN(403),
    SUPERMARKET_NOT_FOUND(404),
    REQUIRED_E_PAYMENT(403),
    PRODUCT_NOT_FOUND(404),
    PRODUCT_CATEGORY_NOT_FOUND(404),
    PRODUCT_SUB_CATEGORY_NOT_FOUND(404),
    ORDER_IS_PAID(403);

    private int code;

    AdditionalResponseCode(int code) {
        this.code = code;
    }

    public int getCode() {
        return this.code;
    }
}
