package com.fpt.capstone.savinghourmarket.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Policy {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(255)")
    private String termsOfService;

    @Column(columnDefinition = "varchar(255)")
    private String privacyPolicy;

    @Column(columnDefinition = "varchar(255)")
    private String operatingRegulations;

    @Column(columnDefinition = "varchar(255)")
    private String shippingPolicy;

    @Column(columnDefinition = "varchar(255)")
    private String returnAndRefundPolicy;

    @Column(columnDefinition = "varchar(255)")
    private String complaintHandlingProcess;

}
