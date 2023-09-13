package com.fpt.capstone.savinghourmarket.entity;

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
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(32)")
    private String username;

    @Column(columnDefinition = "varchar(32)")
    private String password;

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
    private Integer status;

    @OneToMany(
            mappedBy = "customer",
            fetch = FetchType.LAZY
    )
    private List<Order> orderList;

    @OneToMany(
            mappedBy = "customer",
            fetch = FetchType.LAZY
    )
    private List<FeedBack> feedBackList;

}
