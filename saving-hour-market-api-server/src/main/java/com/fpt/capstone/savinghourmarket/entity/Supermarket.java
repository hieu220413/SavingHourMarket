package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.model.SupermarketCreateRequestBody;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Supermarket {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(50)")
    private String name;

    @Column(columnDefinition = "varchar(255)")
    private String address;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @Column(columnDefinition = "varchar(11)")
    private String phone;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "supermarket"
    )
    @JsonIgnore
    private List<Product> productList;

    public Supermarket(SupermarketCreateRequestBody supermarketCreateRequestBody) {
        this.name = supermarketCreateRequestBody.getName();
        this.address = supermarketCreateRequestBody.getAddress();
        this.phone = supermarketCreateRequestBody.getPhone();
        this.status = EnableDisableStatus.ENABLE.ordinal();
    }
}
