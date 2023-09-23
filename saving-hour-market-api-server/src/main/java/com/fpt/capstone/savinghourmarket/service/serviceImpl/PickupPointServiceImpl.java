package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.model.PickupPointSuggestionResponseBody;
import com.fpt.capstone.savinghourmarket.model.PickupPointsSortWithSuggestionsResponseBody;
import com.fpt.capstone.savinghourmarket.repository.PickupPointRepository;
import com.fpt.capstone.savinghourmarket.service.PickupPointService;
import com.google.maps.DistanceMatrixApi;
import com.google.maps.DistanceMatrixApiRequest;
import com.google.maps.GeoApiContext;
import com.google.maps.errors.ApiException;
import com.google.maps.model.DistanceMatrix;
import com.google.maps.model.DistanceMatrixElement;
import com.google.maps.model.DistanceMatrixRow;
import com.google.maps.model.LatLng;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PickupPointServiceImpl implements PickupPointService {
    private final PickupPointRepository pickupPointRepository;
    private final GeoApiContext geoApiContext;
    @Override
    public List<PickupPoint> getAll() {
        List<PickupPoint> pickupPoints = pickupPointRepository.findAll();
        return pickupPoints;
    }

    @Override
    public PickupPointsSortWithSuggestionsResponseBody getWithSortAndSuggestion(Double latitude, Double longitude) throws IOException, InterruptedException, ApiException {
        int numberOfSuggestion = 3;
        List<PickupPoint> pickupPoints = pickupPointRepository.getAllSortByDistance(latitude, longitude);
        List<PickupPointSuggestionResponseBody> pickupPointSuggestionResponseBodyList = new ArrayList<>();
        List<LatLng> latLngs = new ArrayList<>();
        for(int i = 0; i < numberOfSuggestion; i++) {
            pickupPointSuggestionResponseBodyList.add(new PickupPointSuggestionResponseBody(pickupPoints.get(i)));
            latLngs.add(new LatLng(pickupPoints.get(i).getLatitude(), pickupPoints.get(i).getLongitude()));
        }

        DistanceMatrixApiRequest req = DistanceMatrixApi.newRequest(geoApiContext);
        DistanceMatrix distanceMatrix = req
                .origins(new LatLng(latitude, longitude))
                .destinations(
                        latLngs.toArray(new LatLng[numberOfSuggestion])
                )
                .await();
//        Arrays.stream(distanceMatrix.rows).iterator().forEachRemaining(distanceMatrixRow -> {
//            Arrays.stream(distanceMatrixRow.elements).iterator().forEachRemaining(distanceMatrixElement -> {
//                pickupPointSuggestionResponseBodyList.get(i++);
//            });
//        });
        Iterator distanceMatrixRowsIterator = Arrays.stream(distanceMatrix.rows).iterator();
        if (distanceMatrixRowsIterator.hasNext()){
            int i = 0;
            DistanceMatrixRow distanceMatrixRow = (DistanceMatrixRow) distanceMatrixRowsIterator.next();
            Iterator distanceMatrixElementsIterator = Arrays.stream(distanceMatrixRow.elements).iterator();
            while (distanceMatrixElementsIterator.hasNext()){
                DistanceMatrixElement distanceMatrixElement = (DistanceMatrixElement) distanceMatrixElementsIterator.next();
                pickupPointSuggestionResponseBodyList.get(i).setDistance(distanceMatrixElement.distance.humanReadable);
                pickupPointSuggestionResponseBodyList.get(i).setDistanceInValue(distanceMatrixElement.distance.inMeters);
                i++;
            }
        }
        pickupPointSuggestionResponseBodyList.sort((o1, o2) -> (int) (o1.getDistanceInValue() - o2.getDistanceInValue()));

        PickupPointsSortWithSuggestionsResponseBody result = new PickupPointsSortWithSuggestionsResponseBody();
        result.setOtherSortedPickupPointList(pickupPoints);
        result.setSortedPickupPointSuggestionList(pickupPointSuggestionResponseBodyList);
        return result;
    }
}
