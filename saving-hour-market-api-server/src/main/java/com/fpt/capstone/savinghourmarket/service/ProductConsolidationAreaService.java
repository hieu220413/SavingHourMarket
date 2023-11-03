package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import com.fpt.capstone.savinghourmarket.model.ProductConsolidationAreaCreateBody;

import java.util.List;

public interface ProductConsolidationAreaService {
    ProductConsolidationArea create(ProductConsolidationAreaCreateBody productConsolidationAreaCreateBody);

    List<ProductConsolidationArea> getAllProductConsolidationAreaForAdmin(EnableDisableStatus enableDisableStatus);
}
