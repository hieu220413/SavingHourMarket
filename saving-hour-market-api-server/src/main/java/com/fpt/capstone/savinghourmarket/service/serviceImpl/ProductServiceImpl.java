package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.repository.ProductRepository;
import com.fpt.capstone.savinghourmarket.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public List<Product> getProductsForStaff(Boolean isExpiredShown, String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, String quantitySortType, String expiredSortType) {
        Sort sortable;
        if(quantitySortType.equals("ASC")  && expiredSortType.equals("DESC")){
            sortable = Sort.by("expiredDate").descending().and(Sort.by("quantity").ascending());
        }else if (quantitySortType.equals("DESC")  && expiredSortType.equals("ASC")) {
            sortable = Sort.by("expiredDate").ascending().and(Sort.by("quantity").descending());
        }else if (quantitySortType.equals("ASC") && expiredSortType.equals("ASC")){
            sortable = Sort.by("expiredDate").ascending().and(Sort.by("quantity").ascending());
        }else {
            sortable = Sort.by("expiredDate").descending().and(Sort.by("quantity").descending());
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
    public List<Product> getProductsForCustomer(String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, String quantitySortType, String expiredSortType) {
        Sort sortable;
        if(quantitySortType.equals("ASC")  && expiredSortType.equals("DESC")){
            sortable = Sort.by("expiredDate").descending().and(Sort.by("quantity").ascending());
        }else if (quantitySortType.equals("DESC")  && expiredSortType.equals("ASC")) {
            sortable = Sort.by("expiredDate").ascending().and(Sort.by("quantity").descending());
        }else if (quantitySortType.equals("ASC") && expiredSortType.equals("ASC")){
            sortable = Sort.by("expiredDate").ascending().and(Sort.by("quantity").ascending());
        }else {
            sortable = Sort.by("expiredDate").descending().and(Sort.by("quantity").descending());
        }

        Pageable pageableWithSort = PageRequest.of(page, limit, sortable);
        List<Product> productList = productRepository.getProductsForCustomer(supermarketId == null ? null : UUID.fromString(supermarketId)
                , name
                , productCategoryId == null ? null : UUID.fromString(productCategoryId)
                , productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId)
                , pageableWithSort);
        return productList;
    }
}
