package com.fpt.capstone.savinghourmarket.entity;

import com.fpt.capstone.savinghourmarket.model.PickupPointSuggestionResponseBody;
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
public class PickupPoint {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(255)")
    private String address;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @Column(columnDefinition = "decimal(11,8)")
    private Double longitude;

    @Column(columnDefinition = "decimal(10,8)")
    private Double latitude;


    public PickupPoint(PickupPointSuggestionResponseBody pickupPointSuggestionResponseBody) {
        this.id = pickupPointSuggestionResponseBody.getId();
        this.address = pickupPointSuggestionResponseBody.getAddress();
        this.latitude = pickupPointSuggestionResponseBody.getLatitude();
        this.longitude = pickupPointSuggestionResponseBody.getLongitude();
        this.status = pickupPointSuggestionResponseBody.getStatus();

    }
}
