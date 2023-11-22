package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.Staff;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeliverReport {

    public DeliverReport(Staff staff) {
        this.staff = staff;
        this.successDeliveredOrder = Long.parseLong("0");
        this.failDeliveredOrder = Long.parseLong("0");
        this.deliveringOrder = Long.parseLong("0");
        this.assignedOrder = Long.parseLong("0");
    }

    private Staff staff;
    private Long successDeliveredOrder;
    private Long failDeliveredOrder;
    private Long deliveringOrder;
    private Long assignedOrder;
}
