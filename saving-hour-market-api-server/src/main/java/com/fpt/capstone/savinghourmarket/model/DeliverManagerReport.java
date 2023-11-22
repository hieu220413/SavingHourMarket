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
public class DeliverManagerReport {
    private Long successDeliveredOrder;
    private Long failDeliveredOrder;
    private Long waitingForAssignOrder;
    private Long deliveringOrder;
    private List<DeliverReport> deliverReportList;
}
