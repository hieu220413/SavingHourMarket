package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.model.ProductCateWithSubCate;
import com.fpt.capstone.savinghourmarket.model.ProductSubCateOnly;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    List<Product> getProductsForStaff(Boolean isExpiredShown, String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort);

    List<Product> getProductsForCustomer(String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort);

    Product getById(UUID id);

    List<ProductCateWithSubCate> getAllCategory();

    List<ProductSubCateOnly> getAllSubCategory();
}
