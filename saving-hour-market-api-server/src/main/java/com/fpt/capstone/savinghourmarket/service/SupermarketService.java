package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import com.fpt.capstone.savinghourmarket.model.SupermarketAddressCreateBody;
import com.fpt.capstone.savinghourmarket.model.SupermarketCreateRequestBody;
import com.fpt.capstone.savinghourmarket.model.SupermarketListResponseBody;
import com.fpt.capstone.savinghourmarket.model.SupermarketUpdateRequestBody;

import java.util.List;
import java.util.UUID;

public interface SupermarketService {
    Supermarket create(SupermarketCreateRequestBody supermarketCreateRequestBody);
    Supermarket update(SupermarketUpdateRequestBody supermarketUpdateRequestBody, UUID supermarketId);

    Supermarket changeStatus(UUID supermarketId, EnableDisableStatus status);

    SupermarketListResponseBody getSupermarketForStaff(String name, EnableDisableStatus status, Integer page, Integer limit);

    Supermarket createSupermarketAddress(List<SupermarketAddressCreateBody> supermarketAddressCreateBody, UUID supermarketId);
}
