package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.model.ProductCateWithSubCate;
import com.fpt.capstone.savinghourmarket.model.ProductSubCateOnly;
import com.fpt.capstone.savinghourmarket.repository.ProductCategoryRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductSubCategoryRepository;
import com.fpt.capstone.savinghourmarket.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final ProductCategoryRepository productCategoryRepository;
    private final ProductSubCategoryRepository productSubCategoryRepository;

    @Override
    public List<Product> getProductsForStaff(Boolean isExpiredShown, String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort) {
        Sort sortable = Sort.by("expiredDate").ascending();
//        if(quantitySortType.equals("ASC") ){
//            sortable = Sort.by("expiredDate").ascending();
//        }else if (quantitySortType.equals("DESC")) {
//            sortable = Sort.by("expiredDate").ascending();
//        }else if (quantitySortType.equals("ASC")){
//            sortable = Sort.by("expiredDate").ascending();
//        }else {
//            sortable = Sort.by("expiredDate").descending();
//        }

        if(quantitySortType != null) {
            sortable = quantitySortType.toString().equals("ASC") ? Sort.by("quantity").ascending() : Sort.by("quantity").descending();
        }

        if(priceSort != null) {
            sortable = priceSort.toString().equals("ASC") ? Sort.by("price").ascending() : Sort.by("price").descending();
        }

        if(expiredSortType != null) {
            sortable = expiredSortType.toString().equals("ASC") ? Sort.by("expiredDate").ascending() : Sort.by("expiredDate").descending();
        }

        Pageable pageableWithSort = PageRequest.of(page, limit, sortable);
        List<Product> productList = productRepository.getProductsForStaff(supermarketId == null ? null : UUID.fromString(supermarketId)
                , name
                , productCategoryId == null ? null : UUID.fromString(productCategoryId)
                , productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId)
                , isExpiredShown
                , pageableWithSort);

        return productList;
    }

    @Override
    public List<Product> getProductsForCustomer(String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort) {
        Sort sortable = Sort.by("expiredDate").ascending();

        if(quantitySortType != null) {
            sortable = quantitySortType.toString().equals("ASC") ? Sort.by("quantity").ascending() : Sort.by("quantity").descending();
        }

        if(priceSort != null) {
            sortable = priceSort.toString().equals("ASC") ? Sort.by("price").ascending() : Sort.by("price").descending();
        }

        if(expiredSortType != null) {
            sortable = expiredSortType.toString().equals("ASC") ? Sort.by("expiredDate").ascending() : Sort.by("expiredDate").descending();
        }

        Pageable pageableWithSort = PageRequest.of(page, limit, sortable);
        List<Product> productList = productRepository.getProductsForCustomer(supermarketId == null ? null : UUID.fromString(supermarketId)
                , name
                , productCategoryId == null ? null : UUID.fromString(productCategoryId)
                , productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId)
                , pageableWithSort);
        return productList;
    }

    @Override
    @Transactional
    public Product getById(UUID id) {
        Optional<Product> product = productRepository.findByIdCustom(id);
        if(!product.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PRODUCT_NOT_FOUND.getCode()), AdditionalResponseCode.PRODUCT_NOT_FOUND.toString());
        }
        return product.get();
    }

    @Override
    public List<ProductCateWithSubCate> getAllCategory() {
        List<ProductCateWithSubCate> productCategoryList = productCategoryRepository.getAllProductCategoryWithSubCate();
        return productCategoryList;
    }

    @Override
    public List<ProductSubCateOnly> getAllSubCategory() {
        List<ProductSubCateOnly> productSubCateOnlyList = productSubCategoryRepository.findAllSubCategoryOnly();
        return productSubCateOnlyList;
    }
}
