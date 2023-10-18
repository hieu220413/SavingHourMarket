package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.Month;
import com.fpt.capstone.savinghourmarket.common.Quarter;
import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.exception.InvalidExcelFileDataException;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.ProductCateWithSubCate;
import com.fpt.capstone.savinghourmarket.model.ProductCreate;
import com.fpt.capstone.savinghourmarket.model.ProductListResponseBody;
import com.fpt.capstone.savinghourmarket.model.ProductSubCateOnly;
import com.fpt.capstone.savinghourmarket.model.SaleReportResponseBody;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface ProductService {
    ProductListResponseBody getProductsForStaff(Boolean isExpiredShown, String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort);

    ProductListResponseBody getProductsForCustomer(String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort);

    Product getById(UUID id);

    List<ProductCateWithSubCate> getAllCategory();

    List<ProductSubCateOnly> getAllSubCategory();

    Product createProduct(ProductCreate productCreate) throws ResourceNotFoundException;

    List<Product> createProductByExcel(MultipartFile file) throws IOException, InvalidFormatException, InvalidExcelFileDataException;

    SaleReportResponseBody getSaleReportSupermarket(UUID supermarketId, Month month, Quarter quarter, Integer year);

    ProductCategory createCategory(ProductCategoryCreateBody productCategoryCreateBody);

    ProductSubCategory createSubCategory(ProductSubCategoryCreateBody productSubCategoryCreateBody);

    ProductCategory updateProductCategory(ProductCategoryUpdateBody productCategoryUpdateBody, UUID categoryId);

    ProductSubCategory updateProductSubCategory(ProductSubCategoryUpdateBody productSubCategoryUpdateBody, UUID subCategoryId);

}
