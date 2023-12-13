package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.common.Month;
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
import com.fpt.capstone.savinghourmarket.model.SaleReportSupermarketMonthlyResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface ProductService {
    ProductListResponseBody getProductsForStaff(String name, String supermarketId, String productCategoryId, String productSubCategoryId, EnableDisableStatus status, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort, boolean isHiddenBatchShown);

    ProductListCustomerResponseBody getProductsForCustomer(String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort, UUID pickupPointId);

    Product getById(UUID id);

    List<ProductCateWithSubCate> getAllCategory(UUID pickupPointId);

    List<ProductSubCateOnly> getAllSubCategory(UUID pickupPointId);

    Product createProduct(ProductCreate productCreate) throws ResourceNotFoundException;

    ProductExcelResponse createProductByExcel(MultipartFile file) throws IOException, InvalidExcelFileDataException;

    List<SaleReportSupermarketMonthlyResponseBody> getSaleReportSupermarket(UUID supermarketId, Integer year);

    ProductCategory createCategory(ProductCategoryCreateBody productCategoryCreateBody);

    ProductSubCategory createSubCategory(ProductSubCategoryCreateBody productSubCategoryCreateBody);

    ProductCategory updateProductCategory(ProductCategoryUpdateBody productCategoryUpdateBody, UUID categoryId);

    ProductSubCategory updateProductSubCategory(ProductSubCategoryUpdateBody productSubCategoryUpdateBody, UUID subCategoryId);

    ProductExcelResponse createProductList(List<ProductCreateList> productList) throws ResourceNotFoundException;
    
    Product updateProduct(ProductDisplayStaff productDisplayStaff) throws ResourceNotFoundException;

    Product disableProduct(UUID product) throws ResourceNotFoundException;
    
    List<RevenueReportMonthly> getRevenueReportForEachMonth(Integer year);

    List<RevenueReportYearly> getRevenueReportForEachYear();

    List<SupermarketSaleReportResponseBody> getAllSupermarketSaleReport(Integer year);

    List<CateOderQuantityResponseBody> getOrderTotalAllCategorySupermarket(UUID supermarketId, Integer year);

    CategoryListResponseBody getCategoryForStaff(String name, EnableDisableStatus status, Integer page, Integer limit);

    SubCategoryListResponseBody getSubCategoryForStaff(String name, EnableDisableStatus status, UUID productCategoryId, Integer page, Integer limit);

    List<ProductSaleReport> getRevenueReportForEachProduct(Month month, Integer year);

    List<ProductSaleReport> getRevenueReportForEachProductForSupermarket(Month month, Integer year, UUID supermarketId);

    Product enableProduct(UUID productId) throws ResourceNotFoundException;

    List<ProductSubCateOnly> getAllSubCategoryForStaff();

    ProductCategory updateCategoryStatus(EnableDisableStatus status, UUID subCategoryId);

    ProductSubCategory updateSubCategoryStatus(EnableDisableStatus status, UUID subCategoryId);
}
