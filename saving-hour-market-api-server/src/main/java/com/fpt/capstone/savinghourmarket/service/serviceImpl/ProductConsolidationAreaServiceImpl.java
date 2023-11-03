package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.model.ProductConsolidationAreaCreateBody;
import com.fpt.capstone.savinghourmarket.repository.PickupPointRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductConsolidationAreaRepository;
import com.fpt.capstone.savinghourmarket.service.ProductConsolidationAreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductConsolidationAreaServiceImpl implements ProductConsolidationAreaService {

    private final PickupPointRepository pickupPointRepository;
    private final ProductConsolidationAreaRepository productConsolidationAreaRepository;

    @Override
    public List<ProductConsolidationArea> getAllProductConsolidationAreaForAdmin(EnableDisableStatus enableDisableStatus) {
        List<ProductConsolidationArea> productConsolidationAreaList = productConsolidationAreaRepository.getAllWithPickupPoint(enableDisableStatus == null ? null : enableDisableStatus.ordinal());
        return productConsolidationAreaList;
    }

    @Override
    @Transactional
    public ProductConsolidationArea create(ProductConsolidationAreaCreateBody productConsolidationAreaCreateBody) {
        Pattern pattern;
        Matcher matcher;
        HashMap errorFields = new HashMap<>();
        List<PickupPoint> pickupPointList = new ArrayList<>();

        if(productConsolidationAreaCreateBody.getAddress().length() > 255) {
            errorFields.put("addressError", "Maximum character is 255");
        }

        if(productConsolidationAreaCreateBody.getLongitude() < -180 || productConsolidationAreaCreateBody.getLongitude() > 180) {
            errorFields.put("longitudeError", "Range must be from -180 to 180");

        }

        if(productConsolidationAreaCreateBody.getLatitude() < -90 || productConsolidationAreaCreateBody.getLatitude() > 90) {
            errorFields.put("latitudeError", "Range must be from -90 to 90");
        }

        List<PickupPoint> pickupPointForAreaList = new ArrayList<>();
        if(productConsolidationAreaCreateBody.getPickupPointIdList().size() > 0) {
            pickupPointForAreaList = pickupPointRepository.getAllByIdList(productConsolidationAreaCreateBody.getPickupPointIdList());
            List<UUID> pickupPointNotFoundIdList = new ArrayList<>();
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


}
