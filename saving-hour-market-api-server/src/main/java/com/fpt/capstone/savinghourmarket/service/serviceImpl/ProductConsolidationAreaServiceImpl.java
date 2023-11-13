package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.ModifyProductConsolidationAreaForbiddenException;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.repository.OrderRepository;
import com.fpt.capstone.savinghourmarket.repository.PickupPointRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductConsolidationAreaRepository;
import com.fpt.capstone.savinghourmarket.service.ProductConsolidationAreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductConsolidationAreaServiceImpl implements ProductConsolidationAreaService {

    private final PickupPointRepository pickupPointRepository;
    private final ProductConsolidationAreaRepository productConsolidationAreaRepository;

    private final OrderRepository orderRepository;

    @Override
    public List<ProductConsolidationArea> getAllProductConsolidationAreaForStaff(EnableDisableStatus enableDisableStatus) {
        List<ProductConsolidationArea> productConsolidationAreaList = productConsolidationAreaRepository.getAllWithPickupPointForStaff(enableDisableStatus == null ? null : enableDisableStatus.ordinal());
        return productConsolidationAreaList;
    }

    @Override
    public ProductConsolidationAreaListResponse getAllProductConsolidationAreaForAdmin(EnableDisableStatus enableDisableStatus, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page, limit);

        Page<ProductConsolidationArea> result = productConsolidationAreaRepository.getAllWithPickupPointForAdmin(enableDisableStatus == null ? null : enableDisableStatus.ordinal(), pageable);

        int totalPage = result.getTotalPages();
        long totalProductConsolidationArea = result.getTotalElements();

        List<ProductConsolidationArea> productConsolidationAreaList = result.stream().toList();

        return new ProductConsolidationAreaListResponse(productConsolidationAreaList, totalPage, totalProductConsolidationArea);
    }

    @Override
    public List<ProductConsolidationArea> getByPickupPointForStaff(UUID pickupPointId) {
        List<ProductConsolidationArea> productConsolidationAreaList = productConsolidationAreaRepository.getByPickupPoint(pickupPointId);
        return productConsolidationAreaList;
    }

    @Override
    @Transactional
    public ProductConsolidationArea create(ProductConsolidationAreaCreateBody productConsolidationAreaCreateBody) {
        HashMap errorFields = new HashMap<>();
//        List<PickupPoint> pickupPointList = new ArrayList<>();

        if(productConsolidationAreaCreateBody.getAddress().length() > 255) {
            errorFields.put("addressError", "Maximum character is 255");
        }

        if(productConsolidationAreaCreateBody.getLongitude() < -180 || productConsolidationAreaCreateBody.getLongitude() > 180) {
            errorFields.put("longitudeError", "Range must be from -180 to 180");

        }

        if(productConsolidationAreaCreateBody.getLatitude() < -90 || productConsolidationAreaCreateBody.getLatitude() > 90) {
            errorFields.put("latitudeError", "Range must be from -90 to 90");
        }

        if(productConsolidationAreaRepository.findByAddress(productConsolidationAreaCreateBody.getAddress()).isPresent()){
            errorFields.put("addressError", "Duplicated Address found");
        }

        if(productConsolidationAreaRepository.findByLongitudeAndLatitude(productConsolidationAreaCreateBody.getLatitude(), productConsolidationAreaCreateBody.getLongitude()).isPresent()){
            errorFields.put("longitudeError", "Duplicated location found");
            errorFields.put("latitudeError", "Duplicated location found");
        }

        List<PickupPoint> pickupPointForAreaList = new ArrayList<>();
        if(productConsolidationAreaCreateBody.getPickupPointIdList().size() > 0) {
            pickupPointForAreaList = pickupPointRepository.getAllByIdList(productConsolidationAreaCreateBody.getPickupPointIdList());
            Set<UUID> pickupPointNotFoundIdList = new HashSet<>();
            for (UUID pickupPointId : productConsolidationAreaCreateBody.getPickupPointIdList()) {
                if(pickupPointForAreaList.stream().filter(pickupPoint -> pickupPoint.getId().equals(pickupPointId)).toList().size() == 0) {
                    pickupPointNotFoundIdList.add(pickupPointId);
                }
            }
            if(pickupPointNotFoundIdList.size() > 0) {
                errorFields.put("pickupPointListError", "No pickup point with id " + pickupPointNotFoundIdList.stream().map(Objects::toString).collect(Collectors.joining(",")));
            }
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        ProductConsolidationArea productConsolidationArea = new ProductConsolidationArea();
        productConsolidationArea.setAddress(productConsolidationAreaCreateBody.getAddress());
        productConsolidationArea.setLatitude(productConsolidationAreaCreateBody.getLatitude());
        productConsolidationArea.setLongitude(productConsolidationAreaCreateBody.getLongitude());
        productConsolidationArea.setStatus(EnableDisableStatus.ENABLE.ordinal());
        productConsolidationArea.setPickupPointList(pickupPointForAreaList);
        for (PickupPoint pickupPoint : pickupPointForAreaList) {
            pickupPoint.getProductConsolidationAreaList().add(productConsolidationArea);
        }


        return productConsolidationAreaRepository.save(productConsolidationArea);
    }




    @Override
    @Transactional
    public ProductConsolidationArea updateInfo(ProductConsolidationAreaUpdateBody productConsolidationAreaUpdateBody, UUID productConsolidationAreaId) {
        HashMap errorFields = new HashMap<>();
//        List<PickupPoint> pickupPointList = new ArrayList<>();
        Optional<ProductConsolidationArea> productConsolidationArea = productConsolidationAreaRepository.findById(productConsolidationAreaId);

        if(!productConsolidationArea.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PRODUCT_CONSOLIDATION_AREA_NOT_FOUND.getCode()), AdditionalResponseCode.PRODUCT_CONSOLIDATION_AREA_NOT_FOUND.toString());
        }

        List<Order> processingOrderList = orderRepository.findProductConsolidationAreaInProcessingOrderById(productConsolidationArea.get().getId(), PageRequest.of(0,1), List.of(OrderStatus.PROCESSING.ordinal(), OrderStatus.DELIVERING.ordinal(), OrderStatus.PACKAGING.ordinal(), OrderStatus.PACKAGED.ordinal()));
        if(processingOrderList.size() > 0) {
            throw new ModifyProductConsolidationAreaForbiddenException(HttpStatus.valueOf(AdditionalResponseCode.PRODUCT_CONSOLIDATION_AREA_IS_IN_PROCESSING_ORDER.getCode()), AdditionalResponseCode.PRODUCT_CONSOLIDATION_AREA_IS_IN_PROCESSING_ORDER.toString());
        }

        if(productConsolidationAreaUpdateBody.getAddress().length() > 255) {
            errorFields.put("addressError", "Maximum character is 255");
        }

        if(productConsolidationAreaUpdateBody.getLongitude() < -180 || productConsolidationAreaUpdateBody.getLongitude() > 180) {
            errorFields.put("longitudeError", "Range must be from -180 to 180");

        }

        if(productConsolidationAreaUpdateBody.getLatitude() < -90 || productConsolidationAreaUpdateBody.getLatitude() > 90) {
            errorFields.put("latitudeError", "Range must be from -90 to 90");
        }

        Optional<ProductConsolidationArea> productConsolidationAreaForAddress = productConsolidationAreaRepository.findByAddress(productConsolidationAreaUpdateBody.getAddress());
        if(productConsolidationAreaForAddress.isPresent() && !productConsolidationAreaForAddress.get().getId().equals(productConsolidationAreaId)){
            errorFields.put("addressError", "Duplicated Address found");
        }

        Optional<ProductConsolidationArea> productConsolidationAreaForLongAndLat = productConsolidationAreaRepository.findByLongitudeAndLatitude(productConsolidationAreaUpdateBody.getLatitude(), productConsolidationAreaUpdateBody.getLongitude());
        if(productConsolidationAreaForLongAndLat.isPresent() && !productConsolidationAreaForLongAndLat.get().getId().equals(productConsolidationAreaId)){
            errorFields.put("longitudeError", "Duplicated location found");
            errorFields.put("latitudeError", "Duplicated location found");
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        productConsolidationArea.get().setAddress(productConsolidationAreaUpdateBody.getAddress());
        productConsolidationArea.get().setLatitude(productConsolidationAreaUpdateBody.getLatitude());
        productConsolidationArea.get().setLongitude(productConsolidationAreaUpdateBody.getLongitude());

        return productConsolidationArea.get();
    }

    @Override
    @Transactional
    public ProductConsolidationArea updateStatus(EnableDisableStatusChangeBody enableDisableStatusChangeBody) {
        Optional<ProductConsolidationArea> productConsolidationArea = productConsolidationAreaRepository.findById(enableDisableStatusChangeBody.getId());

        if(!productConsolidationArea.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PRODUCT_CONSOLIDATION_AREA_NOT_FOUND.getCode()), AdditionalResponseCode.PRODUCT_CONSOLIDATION_AREA_NOT_FOUND.toString());
        }

        if(enableDisableStatusChangeBody.getEnableDisableStatus().ordinal() == EnableDisableStatus.ENABLE.ordinal()){
            productConsolidationArea.get().setStatus(enableDisableStatusChangeBody.getEnableDisableStatus().ordinal());
        } else {
            List<Order> processingOrderList = orderRepository.findProductConsolidationAreaInProcessingOrderById(productConsolidationArea.get().getId(), PageRequest.of(0,1), List.of(OrderStatus.PROCESSING.ordinal(), OrderStatus.DELIVERING.ordinal(), OrderStatus.PACKAGING.ordinal(), OrderStatus.PACKAGED.ordinal()));
            if(processingOrderList.size() > 0) {
                throw new ModifyProductConsolidationAreaForbiddenException(HttpStatus.valueOf(AdditionalResponseCode.PRODUCT_CONSOLIDATION_AREA_IS_IN_PROCESSING_ORDER.getCode()), AdditionalResponseCode.PRODUCT_CONSOLIDATION_AREA_IS_IN_PROCESSING_ORDER.toString());
            }
            productConsolidationArea.get().setStatus(enableDisableStatusChangeBody.getEnableDisableStatus().ordinal());
        }
        return productConsolidationArea.get();
    }

    @Override
    @Transactional
    public ProductConsolidationArea updatePickupPointList(ProductConsolidationAreaPickupPointUpdateListBody productConsolidationAreaPickupPointUpdateListBody) {
        HashMap errorFields = new HashMap<>();
        Optional<ProductConsolidationArea> productConsolidationArea = productConsolidationAreaRepository.findById(productConsolidationAreaPickupPointUpdateListBody.getId());

        if(!productConsolidationArea.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PRODUCT_CONSOLIDATION_AREA_NOT_FOUND.getCode()), AdditionalResponseCode.PRODUCT_CONSOLIDATION_AREA_NOT_FOUND.toString());
        }

        List<PickupPoint> newPickupPointList = pickupPointRepository.getAllByIdList(productConsolidationAreaPickupPointUpdateListBody.getNewUpdateIdList());
        HashMap<UUID, PickupPoint> newPickupPointHashMap = new HashMap<>();
        for (PickupPoint pickupPoint : newPickupPointList) {
            newPickupPointHashMap.put(pickupPoint.getId(), pickupPoint);
        }

        Set<UUID> pickupPointNotFoundIdList = new HashSet<>();
        for (UUID pickupPointId : productConsolidationAreaPickupPointUpdateListBody.getNewUpdateIdList()) {
            if(!newPickupPointHashMap.containsKey(pickupPointId)){
                pickupPointNotFoundIdList.add(pickupPointId);
            }
        }

        if(pickupPointNotFoundIdList.size() > 0){
            errorFields.put("error", "No pickup point with id " + pickupPointNotFoundIdList.stream().map(Objects::toString).collect(Collectors.joining(",")));
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        // remove all current pickup point
        for (PickupPoint pickupPoint : productConsolidationArea.get().getPickupPointList()){
            pickupPoint.getProductConsolidationAreaList().removeIf(a -> a.getId().equals(productConsolidationAreaPickupPointUpdateListBody.getId()));
        }
        productConsolidationArea.get().setPickupPointList(new ArrayList<>());

        // set all new pickup point
        for (PickupPoint pickupPoint : newPickupPointHashMap.values().stream().collect(Collectors.toList())){
            pickupPoint.getProductConsolidationAreaList().add(productConsolidationArea.get());
        }
        productConsolidationArea.get().getPickupPointList().addAll(newPickupPointHashMap.values().stream().collect(Collectors.toList()));

        return productConsolidationArea.get();
    }
}
