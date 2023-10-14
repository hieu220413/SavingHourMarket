package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.model.ProductCategoryCreateBody;
import com.fpt.capstone.savinghourmarket.repository.ProductCategoryRepository;
import com.fpt.capstone.savinghourmarket.service.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProductCategoryServiceImpl implements ProductCategoryService {
    private final ProductCategoryRepository productCategoryRepository;
    @Override
    public ProductCategory createCategory(ProductCategoryCreateBody productCategoryCreateBody) {
        Pattern pattern;
        Matcher matcher;
        HashMap errorFields = new HashMap<>();

        pattern = Pattern.compile("^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$");
        matcher = pattern.matcher(productCategoryCreateBody.getName());
        if(!matcher.matches()){
            errorFields.put("nameError", "Contain only alphabet en/vn and space. Minimum characters is 2 and maximum is 50");
        }

        if(productCategoryRepository.findByName(productCategoryCreateBody.getName().trim()).isPresent()){
            errorFields.put("nameError", "Duplicate category name");
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        ProductCategory productCategory = new ProductCategory(productCategoryCreateBody);

        return productCategoryRepository.save(productCategory);
    }
}
