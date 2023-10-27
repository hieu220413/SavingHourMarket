package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.model.ProductSubCategoryCreateBody;
import com.fpt.capstone.savinghourmarket.model.ProductSubCategoryUpdateBody;
import com.fpt.capstone.savinghourmarket.repository.ProductCategoryRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductSubCategoryRepository;
import com.fpt.capstone.savinghourmarket.service.ProductSubCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProductSubCategoryServiceImpl implements ProductSubCategoryService {
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductSubCategoryRepository productSubCategoryRepository;
    @Override
    public ProductSubCategory createSubCategory(ProductSubCategoryCreateBody productSubCategoryCreateBody) {
        Pattern pattern;
        Matcher matcher;
        HashMap errorFields = new HashMap<>();
        Optional<ProductCategory> productCategory = productCategoryRepository.findById(productSubCategoryCreateBody.getProductCategoryId());

        if(!productCategory.isPresent()){
            throw new ItemNotFoundException(HttpStatusCode.valueOf(AdditionalResponseCode.PRODUCT_CATEGORY_NOT_FOUND.getCode()), AdditionalResponseCode.PRODUCT_CATEGORY_NOT_FOUND.toString());
        }

        pattern = Pattern.compile("^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$");
        matcher = pattern.matcher(productSubCategoryCreateBody.getName());
        if(!matcher.matches()){
            errorFields.put("nameError", "Contain only alphabet en/vn and space. Minimum characters is 2 and maximum is 50");
        }

        if(productSubCategoryRepository.findByName(productSubCategoryCreateBody.getName().trim()).isPresent()){
            errorFields.put("nameError", "Duplicate sub category name");
        }

        if(productSubCategoryCreateBody.getImageUrl().isBlank()) {
            errorFields.put("imageUrlError", "Url can not be empty");
        }

        if(productSubCategoryCreateBody.getAllowableDisplayThreshold() <= 0) {
            errorFields.put("allowableDisplayThresholdError", "Threshold can not be lower than 1");

        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        ProductSubCategory productSubCategory = new ProductSubCategory(productSubCategoryCreateBody);

        productSubCategory.setProductCategory(productCategory.get());

        return productSubCategoryRepository.save(productSubCategory);
    }

    @Override
    @Transactional
    public ProductSubCategory updateSubCategory(ProductSubCategoryUpdateBody productSubCategoryUpdateBody, UUID subCategoryId) {
        Pattern pattern;
        Matcher matcher;
        HashMap errorFields = new HashMap<>();
        Optional<ProductSubCategory> productSubCategory = productSubCategoryRepository.findByIdWithCate(subCategoryId);

        if(!productSubCategory.isPresent()){
            throw new ItemNotFoundException(HttpStatusCode.valueOf(AdditionalResponseCode.PRODUCT_SUB_CATEGORY_NOT_FOUND.getCode()), AdditionalResponseCode.PRODUCT_SUB_CATEGORY_NOT_FOUND.toString());
        }
        if(productSubCategoryUpdateBody.getProductCategoryId() != null){
            Optional<ProductCategory> productCategory = productCategoryRepository.findById(productSubCategoryUpdateBody.getProductCategoryId());
            if(!productCategory.isPresent()){
                throw new ItemNotFoundException(HttpStatusCode.valueOf(AdditionalResponseCode.PRODUCT_CATEGORY_NOT_FOUND.getCode()), AdditionalResponseCode.PRODUCT_CATEGORY_NOT_FOUND.toString());
            }
            productSubCategory.get().setProductCategory(productCategory.get());
        }

        if(productSubCategoryUpdateBody.getName() != null && !productSubCategoryUpdateBody.getName().isBlank()) {
            pattern = Pattern.compile("^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$");
            matcher = pattern.matcher(productSubCategoryUpdateBody.getName());
            if(!matcher.matches()){
                errorFields.put("nameError", "Contain only alphabet en/vn and space. Minimum characters is 2 and maximum is 50");
            }

            Optional<ProductSubCategory> duplicatedProductSubCategory = productSubCategoryRepository.findByName(productSubCategoryUpdateBody.getName().trim());


            if(duplicatedProductSubCategory.isPresent() && !duplicatedProductSubCategory.get().getId().equals(subCategoryId)){
                errorFields.put("nameError", "Duplicate sub category name");
            }
            productSubCategory.get().setName(productSubCategoryUpdateBody.getName());
        }

        if(productSubCategoryUpdateBody.getImageUrl() != null && !productSubCategoryUpdateBody.getImageUrl().isBlank()) {
            productSubCategory.get().setImageUrl(productSubCategoryUpdateBody.getImageUrl());
        }

        if(productSubCategoryUpdateBody.getAllowableDisplayThreshold() != null) {
            if(productSubCategoryUpdateBody.getAllowableDisplayThreshold() <= 0) {
                errorFields.put("allowableDisplayThresholdError", "Threshold can not be lower than 1");
            }
            productSubCategory.get().setAllowableDisplayThreshold(productSubCategoryUpdateBody.getAllowableDisplayThreshold());
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        return productSubCategory.get();
    }
}
