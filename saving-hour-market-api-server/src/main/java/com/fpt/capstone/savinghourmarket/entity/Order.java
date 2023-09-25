package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
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

    @CreationTimestamp
    private LocalDateTime createdTime;

    private Date deliveryDate;

    @Column(columnDefinition = "text")
    private String qrCodeUrl;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @Column(columnDefinition = "tinyint")
    private Integer payment_method;

    @Column(columnDefinition = "varchar(255)")
    private String addressDeliver;

    @ManyToOne()
    @JoinColumn(
            name = "packager_id",
            referencedColumnName = "id"
    )
    private Staff packager;

    @ManyToOne()
    @JoinColumn(
            name = "deliverer_id",
            referencedColumnName = "id"
    )
    private Staff deliverer;

    @ManyToOne()
    @JoinColumn(
            name = "customer_id",
            referencedColumnName = "id"
    )
    @JsonBackReference
    private Customer customer;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "discount_id",
            referencedColumnName = "id"
    )
    @JsonIgnore
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
    @JsonIgnore
    private OrderGroup orderGroup;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "order"
    )
    @JsonIgnore
    private List<OrderDetail> orderDetailList;
}
