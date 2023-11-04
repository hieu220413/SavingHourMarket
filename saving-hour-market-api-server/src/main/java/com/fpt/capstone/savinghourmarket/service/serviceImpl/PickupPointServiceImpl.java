package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.ModifyPickupPointForbiddenException;
import com.fpt.capstone.savinghourmarket.exception.ModifyProductConsolidationAreaForbiddenException;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.repository.OrderRepository;
import com.fpt.capstone.savinghourmarket.repository.PickupPointRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductConsolidationAreaRepository;
import com.fpt.capstone.savinghourmarket.service.PickupPointService;
import com.google.maps.GeoApiContext;
import com.google.maps.errors.ApiException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PickupPointServiceImpl implements PickupPointService {
    private final PickupPointRepository pickupPointRepository;
    private final ProductConsolidationAreaRepository productConsolidationAreaRepository;
    private final OrderRepository orderRepository;
    private final GeoApiContext geoApiContext;
    @Value("${goong-api-key}")
    private String goongApiKey;
    @Value("${goong-distance-matrix-url}")
    private String goongDistanceMatrixUrl;
    @Override
    public List<PickupPoint> getAll() {
        List<PickupPoint> pickupPoints = pickupPointRepository.findAllForCustomer();
        return pickupPoints;
    }

    @Override
    public List<PickupPointWithProductConsolidationArea> getAllForAdmin(EnableDisableStatus enableDisableStatus) {
        List<PickupPointWithProductConsolidationArea> pickupPointWithProductConsolidationAreaList = pickupPointRepository.findAllForAdmin(enableDisableStatus == null ? null : enableDisableStatus.ordinal());
        return pickupPointWithProductConsolidationAreaList;
    }

    @Override
    @Transactional
    public PickupPointWithProductConsolidationArea create(PickupPointCreateBody pickupPointCreateBody) {
        HashMap errorFields = new HashMap<>();
//        List<PickupPoint> pickupPointList = new ArrayList<>();

        if(pickupPointCreateBody.getAddress().length() > 255) {
            errorFields.put("addressError", "Maximum character is 255");
        }

        if(pickupPointCreateBody.getLongitude() < -180 || pickupPointCreateBody.getLongitude() > 180) {
            errorFields.put("longitudeError", "Range must be from -180 to 180");

        }

        if(pickupPointCreateBody.getLatitude() < -90 || pickupPointCreateBody.getLatitude() > 90) {
            errorFields.put("latitudeError", "Range must be from -90 to 90");
        }

        if(pickupPointRepository.findByAddress(pickupPointCreateBody.getAddress()).isPresent()){
            errorFields.put("addressError", "Duplicated Address found");
        }

        if(pickupPointRepository.findByLongitudeAndLatitude(pickupPointCreateBody.getLatitude(), pickupPointCreateBody.getLongitude()).isPresent()){
            errorFields.put("longitudeError", "Duplicated location found");
            errorFields.put("latitudeError", "Duplicated location found");
        }


        List<ProductConsolidationArea> areaForPickupPointList = new ArrayList<>();
        if(pickupPointCreateBody.getProductConsolidationAreaIdList().size() > 0) {
            areaForPickupPointList = productConsolidationAreaRepository.getAllByIdList(pickupPointCreateBody.getProductConsolidationAreaIdList());
            Set<UUID> areaNotFoundIdList = new HashSet<>();
            for (UUID productConsolidationAreaId : pickupPointCreateBody.getProductConsolidationAreaIdList()) {
                if(areaForPickupPointList.stream().filter(consolidationArea -> consolidationArea.getId().equals(productConsolidationAreaId)).toList().size() == 0) {
                    areaNotFoundIdList.add(productConsolidationAreaId);
                }
            }
            if(areaNotFoundIdList.size() > 0) {
                errorFields.put("productConsolidationAreaListError", "No product consolidation area with id " + areaNotFoundIdList.stream().map(Objects::toString).collect(Collectors.joining(",")));
            }
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        PickupPoint pickupPoint = new PickupPoint();
        pickupPoint.setAddress(pickupPointCreateBody.getAddress());
        pickupPoint.setLatitude(pickupPointCreateBody.getLatitude());
        pickupPoint.setLongitude(pickupPointCreateBody.getLongitude());
        pickupPoint.setStatus(EnableDisableStatus.ENABLE.ordinal());
        pickupPoint.setProductConsolidationAreaList(areaForPickupPointList);

        for (ProductConsolidationArea productConsolidationArea : areaForPickupPointList) {
            productConsolidationArea.getPickupPointList().add(pickupPoint);
        }



        return mapPickupPointToPickupPointWithProductConsolidationArea(pickupPointRepository.save(pickupPoint));
    }

    @Override
    @Transactional
    public PickupPoint updateInfo(PickupPointUpdateBody pickupPointUpdateBody, UUID pickupPointId) {
        HashMap errorFields = new HashMap<>();
//        List<PickupPoint> pickupPointList = new ArrayList<>();
        Optional<PickupPoint> pickupPoint = pickupPointRepository.findById(pickupPointId);

        if(!pickupPoint.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.getCode()), AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.toString());
        }

        List<Order> processingOrderList = orderRepository.findPickupPointInProcessingOrderById(pickupPoint.get().getId(), PageRequest.of(0,1), List.of(OrderStatus.PROCESSING.ordinal(), OrderStatus.DELIVERING.ordinal(), OrderStatus.PACKAGING.ordinal(), OrderStatus.PACKAGED.ordinal()));
        if(processingOrderList.size() > 0) {
            throw new ModifyPickupPointForbiddenException(HttpStatus.valueOf(AdditionalResponseCode.PICKUP_POINT_IS_IN_PROCESSING_ORDER.getCode()), AdditionalResponseCode.PICKUP_POINT_IS_IN_PROCESSING_ORDER.toString());
        }

        if(pickupPointUpdateBody.getAddress().length() > 255) {
            errorFields.put("addressError", "Maximum character is 255");
        }

        if(pickupPointUpdateBody.getLongitude() < -180 || pickupPointUpdateBody.getLongitude() > 180) {
            errorFields.put("longitudeError", "Range must be from -180 to 180");

        }

        if(pickupPointUpdateBody.getLatitude() < -90 || pickupPointUpdateBody.getLatitude() > 90) {
            errorFields.put("latitudeError", "Range must be from -90 to 90");
        }

        Optional<PickupPoint> pickupPointForAddress = pickupPointRepository.findByAddress(pickupPointUpdateBody.getAddress());
        if(pickupPointForAddress.isPresent() && !pickupPointForAddress.get().getId().equals(pickupPointId)){
            errorFields.put("addressError", "Duplicated Address found");
        }

        Optional<PickupPoint> pickupPointForLongAndLat = pickupPointRepository.findByLongitudeAndLatitude(pickupPointUpdateBody.getLatitude(), pickupPointUpdateBody.getLongitude());
        if(pickupPointForLongAndLat.isPresent() && !pickupPointForLongAndLat.get().getId().equals(pickupPointId)){
            errorFields.put("longitudeError", "Duplicated location found");
            errorFields.put("latitudeError", "Duplicated location found");
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        pickupPoint.get().setAddress(pickupPointUpdateBody.getAddress());
        pickupPoint.get().setLatitude(pickupPointUpdateBody.getLatitude());
        pickupPoint.get().setLongitude(pickupPointUpdateBody.getLongitude());

        return pickupPoint.get();
    }

    @Override
    @Transactional
    public PickupPoint updateStatus(EnableDisableStatusChangeBody enableDisableStatusChangeBody) {
        Optional<PickupPoint> pickupPoint = pickupPointRepository.findById(enableDisableStatusChangeBody.getId());

        if(!pickupPoint.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.getCode()), AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.toString());
        }

        if(enableDisableStatusChangeBody.getEnableDisableStatus().ordinal() == EnableDisableStatus.ENABLE.ordinal()){
            pickupPoint.get().setStatus(enableDisableStatusChangeBody.getEnableDisableStatus().ordinal());
        } else {
            List<Order> processingOrderList = orderRepository.findPickupPointInProcessingOrderById(pickupPoint.get().getId(), PageRequest.of(0,1), List.of(OrderStatus.PROCESSING.ordinal(), OrderStatus.DELIVERING.ordinal(), OrderStatus.PACKAGING.ordinal(), OrderStatus.PACKAGED.ordinal()));
            if(processingOrderList.size() > 0) {
                throw new ModifyPickupPointForbiddenException(HttpStatus.valueOf(AdditionalResponseCode.PICKUP_POINT_IS_IN_PROCESSING_ORDER.getCode()), AdditionalResponseCode.PICKUP_POINT_IS_IN_PROCESSING_ORDER.toString());
            }
            pickupPoint.get().setStatus(enableDisableStatusChangeBody.getEnableDisableStatus().ordinal());
        }
        return pickupPoint.get();
    }

    @Override
    @Transactional
    public PickupPointWithProductConsolidationArea updateProductConsolidationAreaList(ProductConsolidationAreaPickupPointUpdateListBody productConsolidationAreaPickupPointUpdateListBody) {
        HashMap errorFields = new HashMap<>();
        Optional<PickupPoint> pickupPoint = pickupPointRepository.findById(productConsolidationAreaPickupPointUpdateListBody.getId());

        if(!pickupPoint.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.getCode()), AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.toString());
        }

        List<ProductConsolidationArea> newProductConsolidationAreaList = productConsolidationAreaRepository.getAllByIdList(productConsolidationAreaPickupPointUpdateListBody.getNewUpdateIdList());
        HashMap<UUID, ProductConsolidationArea> newProductConsolidationAreaHashMap = new HashMap<>();
        for (ProductConsolidationArea productConsolidationArea : newProductConsolidationAreaList) {
            newProductConsolidationAreaHashMap.put(productConsolidationArea.getId(), productConsolidationArea);
        }

        Set<UUID> areaNotFoundIdList = new HashSet<>();
        for (UUID productConsolidationAreaId : productConsolidationAreaPickupPointUpdateListBody.getNewUpdateIdList()) {
            if(!newProductConsolidationAreaHashMap.containsKey(productConsolidationAreaId)){
                areaNotFoundIdList.add(productConsolidationAreaId);
            }
        }

        if(areaNotFoundIdList.size() > 0){
            errorFields.put("productConsolidationAreaListError", "No product consolidation area with id " + areaNotFoundIdList.stream().map(Objects::toString).collect(Collectors.joining(",")));
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        // remove all current pickup point
        for (ProductConsolidationArea productConsolidationArea : pickupPoint.get().getProductConsolidationAreaList()){
            productConsolidationArea.getPickupPointList().removeIf(p -> p.getId().equals(productConsolidationAreaPickupPointUpdateListBody.getId()));
        }
        pickupPoint.get().setProductConsolidationAreaList(new ArrayList<>());

        // set all new pickup point
        for (ProductConsolidationArea productConsolidationArea : newProductConsolidationAreaHashMap.values().stream().collect(Collectors.toList())){
            productConsolidationArea.getPickupPointList().add(pickupPoint.get());
        }
        pickupPoint.get().getProductConsolidationAreaList().addAll(newProductConsolidationAreaHashMap.values().stream().collect(Collectors.toList()));



        return mapPickupPointToPickupPointWithProductConsolidationArea(pickupPoint.get());
    }

    // GOONG API VERSION
    @Override
    public PickupPointsSortWithSuggestionsResponseBody getWithSortAndSuggestion(Double latitude, Double longitude) throws IOException, InterruptedException, ApiException {
        int numberOfSuggestion = 3;
        List<PickupPoint> pickupPoints = pickupPointRepository.getAllSortByDistance(latitude, longitude);
        List<PickupPointSuggestionResponseBody> pointSuggestionResponseBodyFromGoongList = new ArrayList<>();
        List<LatLngModel> destinations = new ArrayList<>();
        LatLngModel origin = new LatLngModel(latitude, longitude);
        for(PickupPoint pickupPoint : pickupPoints) {
            pointSuggestionResponseBodyFromGoongList.add(new PickupPointSuggestionResponseBody(pickupPoint));
            destinations.add(new LatLngModel(pickupPoint.getLatitude().doubleValue(), pickupPoint.getLongitude().doubleValue()));
        }
//        for(int i = 0; i < numberOfSuggestion; i++) {
//            // using 0 because pickup point at index 0 will be deleted and next index will be 0
//            pickupPointSuggestionResponseBodyList.add(new PickupPointSuggestionResponseBody(pickupPoints.get(0)));
//            destinations.add(new LatLngModel(pickupPoints.get(0).getLatitude().doubleValue(), pickupPoints.get(0).getLongitude().doubleValue()));
//            pickupPoints.remove(0);
//        }

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
                pointSuggestionResponseBodyFromGoongList.get(i).setDistance(goongDistanceMatrixElement.getDistance().getText());
                pointSuggestionResponseBodyFromGoongList.get(i).setDistanceInValue(goongDistanceMatrixElement.getDistance().getValue());
                i++;
            }
        }
        pointSuggestionResponseBodyFromGoongList.sort((o1, o2) -> (int) (o1.getDistanceInValue() - o2.getDistanceInValue()));

        //Result mapping
        List<PickupPointSuggestionResponseBody> pickupPointSuggestionResultList = new ArrayList<>();

        for (int i = 0 ; i < numberOfSuggestion; i++){
            pickupPointSuggestionResultList.add(pointSuggestionResponseBodyFromGoongList.get(0));
            pointSuggestionResponseBodyFromGoongList.remove(0);
        }

//        for (int i = numberOfSuggestion ; i < pointSuggestionResponseBodyFromGoongList.size() ; i++) {
//            pickupPointsResultList.add(pointSuggestionResponseBodyFromGoongList.get(i));
//        }

        PickupPointsSortWithSuggestionsResponseBody result = new PickupPointsSortWithSuggestionsResponseBody();
        result.setOtherSortedPickupPointList(pointSuggestionResponseBodyFromGoongList);
        result.setSortedPickupPointSuggestionList(pickupPointSuggestionResultList);
        return result;
    }

    private PickupPointWithProductConsolidationArea mapPickupPointToPickupPointWithProductConsolidationArea (PickupPoint pickupPoint) {
        PickupPointWithProductConsolidationArea pickupPointWithProductConsolidationArea = new PickupPointWithProductConsolidationArea() {
            @Override
            public UUID getId() {
                return pickupPoint.getId();
            }
            @Override
            public String getAddress() {
                return pickupPoint.getAddress();
            }
            @Override
            public Integer getStatus() {
                return pickupPoint.getStatus();
            }
            @Override
            public Double getLongitude() {
                return pickupPoint.getLongitude();
            }
            @Override
            public Double getLatitude() {
                return pickupPoint.getLatitude();
            }
            @Override
            public List<ProductConsolidationAreaOnly> getProductConsolidationAreaList() {
                return pickupPoint.getProductConsolidationAreaList().stream().map(consolidationArea -> new ProductConsolidationAreaOnly() {
                    @Override
                    public UUID getId() {
                        return consolidationArea.getId();
                    }

                    @Override
                    public String getAddress() {
                        return consolidationArea.getAddress();
                    }

                    @Override
                    public Integer getStatus() {
                        return consolidationArea.getStatus();
                    }

                    @Override
                    public Double getLongitude() {
                        return consolidationArea.getLongitude();
                    }

                    @Override
                    public Double getLatitude() {
                        return consolidationArea.getLatitude();
                    }
                }).collect(Collectors.toList());
            }
        };

        return pickupPointWithProductConsolidationArea;
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
