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
public class SubCategoryListResponseBody {
    private List<ProductSubCateOnly> productSubCategoryList;
    private int totalPage;
    private long totalSubCategory;
}
