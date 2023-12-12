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

//@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Policy {
//    @Id
//    @UuidGenerator
    private UUID id;

//    @Column(columnDefinition = "text")
    private String termsOfService;

//    @Column(columnDefinition = "text")
    private String privacyPolicy;

//    @Column(columnDefinition = "text")
    private String operatingRegulations;

//    @Column(columnDefinition = "text")
    private String shippingPolicy;

//    @Column(columnDefinition = "text")
    private String returnAndRefundPolicy;

//    @Column(columnDefinition = "text")
    private String complaintHandlingProcess;

}
