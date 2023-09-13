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

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "order_id",
            referencedColumnName = "id"
    )
    private Order order;

    @OneToOne
    @JoinColumn(
            name = "refund_id",
            referencedColumnName = "id"
    )
    private Transaction refundTransaction;
}
