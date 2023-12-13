package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.model.ProductSubCategoryCreateBody;
import com.fpt.capstone.savinghourmarket.model.ProductSubCategoryUpdateBody;

import java.util.UUID;

public interface ProductSubCategoryService {
    ProductSubCategory createSubCategory(ProductSubCategoryCreateBody productSubCategoryCreateBody);

    ProductSubCategory updateSubCategory(ProductSubCategoryUpdateBody productSubCategoryUpdateBody, UUID subCategoryId);

    ProductSubCategory updateSubCategoryStatus(EnableDisableStatus status, UUID subCategoryId);
}
