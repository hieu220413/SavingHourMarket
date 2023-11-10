package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import com.fpt.capstone.savinghourmarket.model.EnableDisableStatusChangeBody;
import com.fpt.capstone.savinghourmarket.model.ProductConsolidationAreaCreateBody;
import com.fpt.capstone.savinghourmarket.model.ProductConsolidationAreaPickupPointUpdateListBody;
import com.fpt.capstone.savinghourmarket.model.ProductConsolidationAreaUpdateBody;

import java.util.List;
import java.util.UUID;

public interface ProductConsolidationAreaService {
    ProductConsolidationArea create(ProductConsolidationAreaCreateBody productConsolidationAreaCreateBody);

    List<ProductConsolidationArea> getAllProductConsolidationAreaForAdmin(EnableDisableStatus enableDisableStatus);

    ProductConsolidationArea updateInfo(ProductConsolidationAreaUpdateBody productConsolidationAreaUpdateBody, UUID productConsolidationAreaId);

    ProductConsolidationArea updateStatus(EnableDisableStatusChangeBody enableDisableStatusChangeBody);

    ProductConsolidationArea updatePickupPointList(ProductConsolidationAreaPickupPointUpdateListBody productConsolidationAreaPickupPointUpdateListBody);

    List<ProductConsolidationArea> getByPickupPointForStaff(UUID pickupPointId);
}
