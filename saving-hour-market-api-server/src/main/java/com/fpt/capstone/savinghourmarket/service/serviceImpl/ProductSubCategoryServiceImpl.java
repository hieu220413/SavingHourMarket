package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.model.ProductSubCategoryCreateBody;
import com.fpt.capstone.savinghourmarket.repository.ProductCategoryRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductSubCategoryRepository;
import com.fpt.capstone.savinghourmarket.service.ProductSubCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;

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
}
