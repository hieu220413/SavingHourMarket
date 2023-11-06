package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.LinkedHashMap;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportOrdersResponse {
    List<OrderReport> ordersReportByDay;
    LinkedHashMap<Integer, List<OrderReportMonth>> ordersReportByMonth;
    List<OrderReportYear> ordersReportByYear;
}
