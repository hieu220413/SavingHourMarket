package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.model.ProductSubCategoryCreateBody;

public interface ProductSubCategoryService {
    ProductSubCategory createSubCategory(ProductSubCategoryCreateBody productSubCategoryCreateBody);
}
