package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.model.CustomerRegisterRequestBody;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Customer {

    public Customer(CustomerRegisterRequestBody customerRegisterRequestBody) {
        this.fullName = customerRegisterRequestBody.getFullName();
        this.email = customerRegisterRequestBody.getEmail();
        this.phone = customerRegisterRequestBody.getPhone();
        this.dateOfBirth = LocalDate.parse(customerRegisterRequestBody.getDateOfBirth());
        this.avatarUrl = customerRegisterRequestBody.getAvatarUrl();
        this.address = customerRegisterRequestBody.getAddress();
        this.gender = customerRegisterRequestBody.getGender();
        this.status = EnableDisableStatus.ENABLE.ordinal();
    }

    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(50)")
    private String fullName;

    @Column(columnDefinition = "varchar(255)")
    private String email;

    @Column(columnDefinition = "varchar(11)")
    private String phone;

    private LocalDate dateOfBirth;

    @Column(columnDefinition = "text")
    private String avatarUrl;

    @Column(columnDefinition = "varchar(255)")
    private String address;

    @Column(columnDefinition = "tinyint")
    private Integer gender;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @OneToMany(
            mappedBy = "customer",
            fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<Order> orderList;

    @OneToMany(
            mappedBy = "customer",
            fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<FeedBack> feedBackList;


}
