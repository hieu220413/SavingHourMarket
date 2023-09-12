package com.fpt.capstone.savinghourmarket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Transaction {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(10)")
    private String paymentMethod;

    private LocalDateTime paymentTime;

    private Integer amountOfMoney;

    private Long transactionNo;

    @OneToOne(
            mappedBy = "transaction",
            fetch = FetchType.LAZY
    )
    private Order order;
}
