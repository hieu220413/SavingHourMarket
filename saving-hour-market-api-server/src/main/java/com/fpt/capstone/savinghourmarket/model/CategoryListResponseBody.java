package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryListResponseBody {
    private List<ProductCateWithSubCate> productCategoryList;
    private int totalPage;
    private long totalCategory;
}
