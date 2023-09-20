package com.fpt.capstone.savinghourmarket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(name = "orders")
public class Order {
    @Id
    @UuidGenerator
    private UUID id;

    private Integer shippingFee;

    private Integer totalPrice;

    private LocalDateTime createdTime;

    private Date deliveryDate;

    @Column(columnDefinition = "text")
    private String qrCodeUrl;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @Column(columnDefinition = "varchar(255)")
    private String addressDeliver;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "packager_id",
            referencedColumnName = "id"
    )
    private Staff packager;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "deliverer_id",
            referencedColumnName = "id"
    )
    private Staff deliverer;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "customer_id",
            referencedColumnName = "id"
    )
    private Customer customer;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "discount_id",
            referencedColumnName = "id"
    )
    private Discount discount;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "order"
    )
    private List<Transaction> transaction;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "order_group_id",
            referencedColumnName = "id"
    )
    private OrderGroup orderGroup;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "order"
    )
    private List<OrderDetail> orderDetailList;
}
