package com.fpt.capstone.savinghourmarket.model;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class DiscountsUsageReportResponseBody {

    public DiscountsUsageReportResponseBody() {
        this.discountReportList = new ArrayList<>();
        this.totalDiscountUsage = 0;
    }

    private List<DiscountReport> discountReportList;
    private int totalDiscountUsage;
}
