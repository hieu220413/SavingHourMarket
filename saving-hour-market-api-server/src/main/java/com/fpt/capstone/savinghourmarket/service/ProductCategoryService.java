package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.model.ProductCategoryCreateBody;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductCategoryService {
    ProductCategory createCategory(ProductCategoryCreateBody productCategoryCreateBody);
}
