package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpt.capstone.savinghourmarket.model.PickupPointSuggestionResponseBody;
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
public class PickupPoint {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(255)")
    private String address;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @Column(columnDefinition = "decimal(23,20)")
    private Double longitude;

    @Column(columnDefinition = "decimal(22,20)")
    private Double latitude;

    @ManyToMany(
            fetch = FetchType.LAZY
    )
    @JoinTable(
            name = "pickup_point_product_consolidation_area",
            joinColumns = @JoinColumn(name = "pickup_point_id"),
            inverseJoinColumns = @JoinColumn(name = "product_consolidation_area_id")
    )
    @JsonIgnore
    private List<ProductConsolidationArea> productConsolidationAreaList;


    public PickupPoint(PickupPointSuggestionResponseBody pickupPointSuggestionResponseBody) {
        this.id = pickupPointSuggestionResponseBody.getId();
        this.address = pickupPointSuggestionResponseBody.getAddress();
        this.latitude = pickupPointSuggestionResponseBody.getLatitude();
        this.longitude = pickupPointSuggestionResponseBody.getLongitude();
        this.status = pickupPointSuggestionResponseBody.getStatus();

    }
}
