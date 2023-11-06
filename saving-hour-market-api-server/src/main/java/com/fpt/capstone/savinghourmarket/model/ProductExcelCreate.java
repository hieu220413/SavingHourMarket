package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductExcelCreate {

    private String name;

    private String description;

    private ProductSubCategory productSubCategory;

    private Supermarket supermarket;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        ProductExcelCreate other = (ProductExcelCreate) obj;
        return Objects.equals(name, other.name) &&
                Objects.equals(description, other.description) &&
                Objects.equals(productSubCategory, other.productSubCategory) &&
                Objects.equals(supermarket, other.supermarket);
    }

    // Override the hashCode method to generate a hash code based on all fields
    @Override
    public int hashCode() {
        return Objects.hash(name, description, productSubCategory, supermarket);
    }
}
