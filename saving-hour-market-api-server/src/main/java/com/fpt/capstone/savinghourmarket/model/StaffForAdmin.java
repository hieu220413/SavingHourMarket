package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.entity.Staff;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StaffForAdmin {

    public StaffForAdmin(Staff staff) {
        this.id = staff.getId();
        this.fullName = staff.getFullName();
        this.email = staff.getEmail();
        this.avatarUrl = staff.getAvatarUrl();
        this.role = staff.getRole();
        this.status = staff.getStatus();
        this.deliverManagerStaff = staff.getDeliverManagerStaff();
        this.deliverStaffList = staff.getDeliverStaffList().stream().map(deliver -> {
            deliver.getDeliverManagerStaff().setDeliverStaffList(null);
            return deliver;
        }).collect(Collectors.toList());
        this.pickupPoint = staff.getPickupPoint();
    }

    private UUID id;

    private String fullName;

    private String email;

    private String avatarUrl;

    private String role;

    private Integer status;

    private Staff deliverManagerStaff;

    private List<Staff> deliverStaffList;

    private List<PickupPoint> pickupPoint;
}
