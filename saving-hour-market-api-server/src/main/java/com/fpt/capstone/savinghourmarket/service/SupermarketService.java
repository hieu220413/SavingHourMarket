package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import com.fpt.capstone.savinghourmarket.model.SupermarketCreateRequestBody;
import com.fpt.capstone.savinghourmarket.model.SupermarketUpdateRequestBody;

import java.util.UUID;

public interface SupermarketService {
    Supermarket create(SupermarketCreateRequestBody supermarketCreateRequestBody);
    Supermarket update(SupermarketUpdateRequestBody supermarketUpdateRequestBody, UUID supermarketId);
}
