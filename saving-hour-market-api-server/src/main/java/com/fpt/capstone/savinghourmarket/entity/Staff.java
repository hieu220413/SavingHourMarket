package com.fpt.capstone.savinghourmarket.entity;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.common.StaffRole;
import com.fpt.capstone.savinghourmarket.model.StaffCreateRequestBody;
import com.fpt.capstone.savinghourmarket.util.Utils;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Staff {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(50) CHARACTER SET utf8 COLLATE utf8_bin")
    private String fullName;

    @Column(columnDefinition = "varchar(255)")
    private String email;

    @Column(columnDefinition = "text")
    private String avatarUrl;

    @Column(columnDefinition = "varchar(15)")
    private String role;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @ManyToMany(
            fetch = FetchType.LAZY
    )
    @JoinTable(
            name = "staff_pickup_point",
            joinColumns = @JoinColumn(name = "staff_id"),
            inverseJoinColumns = @JoinColumn(name = "pickup_point_id")
    )
    private List<PickupPoint> pickupPoint;
    

    public Staff(StaffCreateRequestBody staffCreateRequestBody, StaffRole role) throws UnsupportedEncodingException {
        this.fullName = staffCreateRequestBody.getFullName();
        this.email = staffCreateRequestBody.getEmail();
        this.role = role.toString();
        this.avatarUrl = Utils.generatePublicImageUrlFirebaseStorage("public/default-avatar.jpg");
        this.status = EnableDisableStatus.ENABLE.ordinal();
    }
}
