package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PickupPointsSortWithSuggestionsResponseBody {
    private List<PickupPointSuggestionResponseBody> sortedPickupPointSuggestionList;
    private List<PickupPointSuggestionResponseBody> otherSortedPickupPointList;
}
