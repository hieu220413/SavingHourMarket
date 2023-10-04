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

    private String receiverPhone;

    private String receiverName;

    private Integer totalDiscountPrice;

    @CreationTimestamp
    @Column(columnDefinition = "datetime(0)")
    private LocalDateTime createdTime;

    private Date deliveryDate;

    @Column(columnDefinition = "text")
    private String qrCodeUrl;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @Column(columnDefinition = "tinyint")
    private Integer paymentMethod;

    @Column(columnDefinition = "varchar(255)")
    private String addressDeliver;

    @Column(columnDefinition = "tinyint")
    private Integer paymentStatus;

    @ManyToOne()
    @JoinColumn(
            name = "packager_id",
            referencedColumnName = "id"
    )
    private Staff packager;

    @ManyToOne()
    @JoinColumn(
            name = "customer_id",
            referencedColumnName = "id"
    )
    private Customer customer;

    @ManyToMany(
            fetch = FetchType.LAZY
    )
    @JoinTable(
            name = "discount_order",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "discount_id")
    )
    @JsonIgnore
    private List<Discount> discountList;

    @OneToMany(
            mappedBy = "order"
    )
    private List<Transaction> transaction;

    @ManyToOne(
    )
    @JoinColumn(
            name = "order_group_id",
            referencedColumnName = "id"
    )
    @JsonIgnore
    private OrderGroup orderGroup;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "order_batch_id",
            referencedColumnName = "id"
    )
    @JsonIgnore
    private OrderBatch orderBatch;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL
    )
    @JsonIgnore
    private List<OrderDetail> orderDetailList;
}
