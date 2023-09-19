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
public class Staff {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(50)")
    private String fullName;

    @Column(columnDefinition = "varchar(255)")
    private String email;

    @Column(columnDefinition = "text")
    private String avatarUrl;

    @Column(columnDefinition = "varchar(10)")
    private String role;

    @Column(columnDefinition = "tinyint")
    private Integer status;
}
