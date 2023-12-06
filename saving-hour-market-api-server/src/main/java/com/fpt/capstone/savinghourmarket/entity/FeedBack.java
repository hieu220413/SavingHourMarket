package com.fpt.capstone.savinghourmarket.entity;

import com.fpt.capstone.savinghourmarket.common.FeedbackObject;
import com.fpt.capstone.savinghourmarket.common.FeedbackStatus;
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
public class FeedBack {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "tinyint")
    private Integer rate;

    @Column(columnDefinition = "text")
    private String message;

    @Column(columnDefinition = "text")
    private String responseMessage;

    @Enumerated(EnumType.ORDINAL)
    private FeedbackStatus status;

    @CreationTimestamp
    @Column(columnDefinition = "datetime(0)")
    private LocalDateTime createdTime;

    @OneToMany(
            mappedBy = "feedBack",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )
    private List<FeedBackImage> imageUrls;

    @Enumerated(EnumType.STRING)
    private FeedbackObject object;

    @ManyToOne(
            fetch = FetchType.EAGER,
            cascade = CascadeType.ALL
    )
    @JoinColumn(
            name = "customer_id",
            referencedColumnName = "id"
    )
    private Customer customer;

    @OneToOne(
            fetch = FetchType.EAGER,
            cascade = CascadeType.ALL
    )
    @JoinColumn(
            name = "order_id",
            referencedColumnName = "id"
    )
    private Order order;
}
