package com.fpt.capstone.savinghourmarket.entity;

import jakarta.persistence.*;
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
public class FeedBack {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "tinyint")
    private Integer rate;

    @Column(columnDefinition = "text")
    private String message;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @Column(columnDefinition = "varchar(255)")
    private String object;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "customer_id",
            referencedColumnName = "id"
    )
    private Customer customer;
}
