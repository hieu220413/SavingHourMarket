package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.model.*;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PickupPointServiceImpl implements PickupPointService {
    private final PickupPointRepository pickupPointRepository;
    private final GeoApiContext geoApiContext;
    @Value("${goong-api-key}")
    private String goongApiKey;
    @Value("${goong-distance-matrix-url}")
    private String goongDistanceMatrixUrl;
    @Override
    public List<PickupPoint> getAll() {
        List<PickupPoint> pickupPoints = pickupPointRepository.findAll();
        return pickupPoints;
    }

    // GOONG API VERSION
    @Override
    public PickupPointsSortWithSuggestionsResponseBody getWithSortAndSuggestion(Double latitude, Double longitude) throws IOException, InterruptedException, ApiException {
        int numberOfSuggestion = 3;
        List<PickupPoint> pickupPoints = pickupPointRepository.getAllSortByDistance(latitude, longitude);
        List<PickupPointSuggestionResponseBody> pickupPointSuggestionResponseBodyList = new ArrayList<>();
        List<LatLngModel> destinations = new ArrayList<>();
        LatLngModel origin = new LatLngModel(latitude, longitude);
        for(int i = 0; i < numberOfSuggestion; i++) {
            // using 0 because pickup point at index 0 will be deleted and next index will be 0
            pickupPointSuggestionResponseBodyList.add(new PickupPointSuggestionResponseBody(pickupPoints.get(0)));
            destinations.add(new LatLngModel(pickupPoints.get(0).getLatitude().doubleValue(), pickupPoints.get(0).getLongitude().doubleValue()));
            pickupPoints.remove(0);
        }

        // fetch goong api
        String apiKeyParam = "api_key=" + goongApiKey;
        String vehicleParam = "vehicle=bike";
        String originParam = "origins=" + origin;
        String destinationParam = "destinations=" + destinations.stream().map(latLngModel -> latLngModel.toString()).collect(Collectors.joining("%7C"));
        String goongMatrixDistanceRequest = goongDistanceMatrixUrl + "?" + originParam + "&" + destinationParam + "&" + vehicleParam + "&" + apiKeyParam;
        RestTemplate restTemplate = new RestTemplate();
        URI goongMatrixDistanceRequestURI = URI.create(goongMatrixDistanceRequest);
        GoongDistanceMatrixResult goongDistanceMatrixResult = restTemplate.getForObject(goongMatrixDistanceRequestURI, GoongDistanceMatrixResult.class);

//        Arrays.stream(distanceMatrix.rows).iterator().forEachRemaining(distanceMatrixRow -> {
//            Arrays.stream(distanceMatrixRow.elements).iterator().forEachRemaining(distanceMatrixElement -> {
//                pickupPointSuggestionResponseBodyList.get(i++);
//            });
//        });
        for (GoongDistanceMatrixRow goongDistanceMatrixRow : goongDistanceMatrixResult.getRows()){
            int i = 0;
            for (GoongDistanceMatrixElement goongDistanceMatrixElement : goongDistanceMatrixRow.getElements()){
                pickupPointSuggestionResponseBodyList.get(i).setDistance(goongDistanceMatrixElement.getDistance().getText());
                pickupPointSuggestionResponseBodyList.get(i).setDistanceInValue(goongDistanceMatrixElement.getDistance().getValue());
                i++;
            }
        }
        pickupPointSuggestionResponseBodyList.sort((o1, o2) -> (int) (o1.getDistanceInValue() - o2.getDistanceInValue()));



        PickupPointsSortWithSuggestionsResponseBody result = new PickupPointsSortWithSuggestionsResponseBody();
        result.setOtherSortedPickupPointList(pickupPoints);
        result.setSortedPickupPointSuggestionList(pickupPointSuggestionResponseBodyList);
        return result;
    }


    // GOOGLE API VERSION
//    @Override
//    public PickupPointsSortWithSuggestionsResponseBody getWithSortAndSuggestion(Double latitude, Double longitude) throws IOException, InterruptedException, ApiException {
//        int numberOfSuggestion = 3;
//        List<PickupPoint> pickupPoints = pickupPointRepository.getAllSortByDistance(latitude, longitude);
//        List<PickupPointSuggestionResponseBody> pickupPointSuggestionResponseBodyList = new ArrayList<>();
//        List<LatLng> latLngs = new ArrayList<>();
//        for(int i = 0; i < numberOfSuggestion; i++) {
//            // using 0 because pickup point at index 0 will be deleted and next index will be 0
//            pickupPointSuggestionResponseBodyList.add(new PickupPointSuggestionResponseBody(pickupPoints.get(0)));
//            latLngs.add(new LatLng(pickupPoints.get(0).getLatitude(), pickupPoints.get(0).getLongitude()));
//            pickupPoints.remove(0);
//        }
//
//        DistanceMatrixApiRequest req = DistanceMatrixApi.newRequest(geoApiContext);
//        DistanceMatrix distanceMatrix = req
//                .origins(new LatLng(latitude, longitude))
//                .destinations(
//                        latLngs.toArray(new LatLng[numberOfSuggestion])
//                )
//                .await();
////        Arrays.stream(distanceMatrix.rows).iterator().forEachRemaining(distanceMatrixRow -> {
////            Arrays.stream(distanceMatrixRow.elements).iterator().forEachRemaining(distanceMatrixElement -> {
////                pickupPointSuggestionResponseBodyList.get(i++);
////            });
////        });
//        Iterator distanceMatrixRowsIterator = Arrays.stream(distanceMatrix.rows).iterator();
//        if (distanceMatrixRowsIterator.hasNext()){
//            int i = 0;
//            DistanceMatrixRow distanceMatrixRow = (DistanceMatrixRow) distanceMatrixRowsIterator.next();
//            Iterator distanceMatrixElementsIterator = Arrays.stream(distanceMatrixRow.elements).iterator();
//            while (distanceMatrixElementsIterator.hasNext()){
//                DistanceMatrixElement distanceMatrixElement = (DistanceMatrixElement) distanceMatrixElementsIterator.next();
//                pickupPointSuggestionResponseBodyList.get(i).setDistance(distanceMatrixElement.distance.humanReadable);
//                pickupPointSuggestionResponseBodyList.get(i).setDistanceInValue(distanceMatrixElement.distance.inMeters);
//                i++;
//            }
//        }
//        pickupPointSuggestionResponseBodyList.sort((o1, o2) -> (int) (o1.getDistanceInValue() - o2.getDistanceInValue()));
//
//
//
//        PickupPointsSortWithSuggestionsResponseBody result = new PickupPointsSortWithSuggestionsResponseBody();
//        result.setOtherSortedPickupPointList(pickupPoints);
//        result.setSortedPickupPointSuggestionList(pickupPointSuggestionResponseBodyList);
//        return result;
//    }
}
