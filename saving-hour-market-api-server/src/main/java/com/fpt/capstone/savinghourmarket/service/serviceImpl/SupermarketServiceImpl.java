package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.*;
import com.fpt.capstone.savinghourmarket.exception.DeleteSuperMarketAddressForbiddenException;
import com.fpt.capstone.savinghourmarket.exception.DisableSupermarketForbidden;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.repository.*;
import com.fpt.capstone.savinghourmarket.service.SupermarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupermarketServiceImpl implements SupermarketService {

    private final SupermarketRepository supermarketRepository;

    private final ProductRepository productRepository;

    private final ProductBatchRepository productBatchRepository;

    private final SupermarketAddressRepository supermarketAddressRepository;

    private final PickupPointRepository pickupPointRepository;

    @Override
    @Transactional
    public Supermarket create(SupermarketCreateRequestBody supermarketCreateRequestBody) {
        Pattern pattern;
        Matcher matcher;
        HashMap<String,String> errorFields = new HashMap<>();
        HashMap<UUID, PickupPoint> pickupPointFromAddressHashMap = new HashMap<>();

        //name validate
        if(supermarketCreateRequestBody.getName().trim().length() < 2 || supermarketCreateRequestBody.getName().trim().length() > 50){
            errorFields.put("nameError", "Minimum character is 2 and maximum characters is 50");
        }

        //duplicate name check
        if(supermarketRepository.findByName(supermarketCreateRequestBody.getName().trim()).isPresent()) {
            errorFields.put("nameError", "Duplicate supermarket name");
        }

        //phone format validate
        pattern = Pattern.compile("^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$");
        matcher = pattern.matcher(supermarketCreateRequestBody.getPhone());
        if(!matcher.matches()){
            errorFields.put("phoneError", "Invalid phone number format");
        }

        // validate all address in request
        HashMap<String, SupermarketAddressCreateBody> addressHashMap = new HashMap<>();
        supermarketCreateRequestBody.getSupermarketAddressList().stream().forEach(s -> {
            if(!errorFields.containsKey("addressError")) {
                if(!addressHashMap.containsKey(s.getAddress().toUpperCase())){
                    addressHashMap.put(s.getAddress().toUpperCase(), s);
                } else {
                    errorFields.put("addressError", "Duplicate address found in request (" + s.getAddress() + ")");
                }
            }
        });
//        HashSet<String> addressHashSet = new HashSet<>();
//        addressHashSet.addAll(addressHashMap.values());

        if(!errorFields.containsKey("addressError")){
            List<PickupPoint> pickupPointFromAddressList = pickupPointRepository.getAllByIdList(addressHashMap.values().stream().map(supermarketAddressCreateBody -> supermarketAddressCreateBody.getPickupPointId()).collect(Collectors.toList()));
            // map pickPoint from address list to hashmap
            for (PickupPoint pickupPoint : pickupPointFromAddressList){
                pickupPointFromAddressHashMap.put(pickupPoint.getId(), pickupPoint);
            }
            // hashmap to track unfound pickup point
            HashMap<UUID, UUID> pickupPointNotFoundHashMap = new HashMap<>();
            for(SupermarketAddressCreateBody supermarketAddressCreateBody : addressHashMap.values()) {
                // check pickup point
                if(!pickupPointFromAddressHashMap.containsKey(supermarketAddressCreateBody.getPickupPointId())){
                    pickupPointNotFoundHashMap.put(supermarketAddressCreateBody.getPickupPointId(),supermarketAddressCreateBody.getPickupPointId());
//                    if(errorFields.containsKey("addressError")){
//                        String errorField = errorFields.get("addressError");
//                        errorField += errorFields.get("addressError") + "," + supermarketAddressCreateBody.getPickupPointId();
//                        errorFields.put("addressError", errorField);
//                    } else {
//                        errorFields.put("addressError", "No pickup point with id " + supermarketAddressCreateBody.getPickupPointId());
//                    }
                }
            }
            if(pickupPointNotFoundHashMap.size() > 0) {
                errorFields.put("addressError", "No pickup point with id " + pickupPointNotFoundHashMap.values().stream().collect(Collectors.toList()).stream()
                        .map(Object::toString).collect(Collectors.joining(",")));
            }
        }

        if(!errorFields.containsKey("addressError")) {
            for(SupermarketAddressCreateBody supermarketAddressCreateBody : addressHashMap.values()) {
                if((supermarketAddressCreateBody.getAddress().length() > 255 || supermarketAddressCreateBody.getAddress().isBlank()) && !errorFields.containsKey("addressError")){
                    errorFields.put("addressError", "Maximum character is 255 and can not be empty");
                }
            }
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        Supermarket supermarket = new Supermarket(supermarketCreateRequestBody);

        Supermarket persistedSupermarket = supermarketRepository.save(supermarket);

        List<SupermarketAddress> supermarketAddressList = supermarketAddressRepository.saveAll(addressHashMap.values().stream().map(s -> new SupermarketAddress(s.getAddress(), persistedSupermarket, pickupPointFromAddressHashMap.get(s.getPickupPointId()))).collect(Collectors.toList()));

        persistedSupermarket.setSupermarketAddressList(supermarketAddressList);

        return persistedSupermarket;
    }

//    @Override
//    @Transactional
//    public Supermarket update(SupermarketUpdateRequestBody supermarketUpdateRequestBody, UUID supermarketId) {
//        Pattern pattern;
//        Matcher matcher;
//        HashMap<String,String> errorFields = new HashMap<>();
//        HashMap<UUID, PickupPoint> pickupPointFromAddressHashMap = new HashMap<>();
//        Optional<Supermarket> supermarket = supermarketRepository.findById(supermarketId);
//
//        if(!supermarket.isPresent()){
//            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.SUPERMARKET_NOT_FOUND.getCode()), AdditionalResponseCode.SUPERMARKET_NOT_FOUND.toString());
//        }
//
//
//        //name validate
//        if(supermarketUpdateRequestBody.getName() != null && !supermarketUpdateRequestBody.getName().isBlank()){
//            if(supermarketUpdateRequestBody.getName().trim().length() < 2 || supermarketUpdateRequestBody.getName().trim().length() > 50){
//                errorFields.put("nameError", "Minimum character is 2 and maximum characters is 50");
//            }
//            Optional<Supermarket> duplicateSupermarket = supermarketRepository.findByName(supermarketUpdateRequestBody.getName().trim());
//            if(duplicateSupermarket.isPresent() && !duplicateSupermarket.get().getId().equals(supermarketId)) {
//                errorFields.put("nameError", "Duplicate supermarket name");
//            }
//            if(!errorFields.containsKey("nameError")){
//                supermarket.get().setName(supermarketUpdateRequestBody.getName());
//            }
//        }
//
//        //phone format validate
//        if(supermarketUpdateRequestBody.getPhone() != null && !supermarketUpdateRequestBody.getPhone().isBlank()){
//            pattern = Pattern.compile("^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$");
//            matcher = pattern.matcher(supermarketUpdateRequestBody.getPhone());
//            if(!matcher.matches()){
//                errorFields.put("phoneError", "Invalid phone number format");
//            } else {
//                supermarket.get().setPhone(supermarketUpdateRequestBody.getPhone());
//            }
//        }
//
//        // validate all address
//        if(supermarketUpdateRequestBody.getSupermarketAddressList() != null && !supermarketUpdateRequestBody.getSupermarketAddressList().isEmpty()){
//            HashMap<String, SupermarketAddressUpdateBody> addressHashMap = new HashMap<>();
//            supermarketUpdateRequestBody.getSupermarketAddressList().stream().forEach(s -> {
//                if(!errorFields.containsKey("addressError")) {
//                    if(!addressHashMap.containsKey(s.getAddress().toUpperCase())){
//                        addressHashMap.put(s.getAddress().toUpperCase(), s);
//                    } else {
//                        errorFields.put("addressError", "Duplicate address found (" + s.getAddress() + ")");
//                    }
//                }
//            });
//
//            if(!errorFields.containsKey("addressError")){
//                List<PickupPoint> pickupPointFromAddressList = pickupPointRepository.getAllByIdList(addressHashMap.values().stream().map(supermarketUpdateRequestBody1 -> supermarketUpdateRequestBody1.getPickupPointId()).collect(Collectors.toList()));
//                // map pickPoint from address list to hashmap
//                for (PickupPoint pickupPoint : pickupPointFromAddressList){
//                    pickupPointFromAddressHashMap.put(pickupPoint.getId(), pickupPoint);
//                }
//                for(SupermarketAddressUpdateBody supermarketAddressUpdateBody : addressHashMap.values()) {
//                    // check pickup point
//                    if(!pickupPointFromAddressHashMap.containsKey(supermarketAddressUpdateBody.getPickupPointId())){
//                        if(errorFields.containsKey("addressError")){
//                            String errorField = errorFields.get("addressError");
//                            errorField += errorFields.get("addressError") + "," + supermarketAddressUpdateBody.getPickupPointId();
//                            errorFields.put("addressError", errorField);
//                        } else {
//                            errorFields.put("addressError", "No pickup point with id " + supermarketAddressUpdateBody.getPickupPointId());
//                        }
//                    }
//                }
//            }
//
//            if(!errorFields.containsKey("addressError")) {
//                for(SupermarketAddressUpdateBody supermarketAddressUpdateBody : addressHashMap.values()) {
//                    if((supermarketAddressUpdateBody.getAddress().length() > 255 || supermarketAddressUpdateBody.getAddress().isBlank()) && !errorFields.containsKey("addressError")){
//                        errorFields.put("addressError", "Maximum character is 255 and can not be empty");
//                    }
//                }
//            }
//
//            if(!errorFields.containsKey("addressError")){
//
//                // delete all old address
//                supermarketAddressRepository.deleteAll(supermarket.get().getSupermarketAddressList());
//                supermarket.get().setSupermarketAddressList(null);
//                // add all new address
//                List<SupermarketAddress> supermarketAddressList = supermarketAddressRepository.saveAll(addressHashMap.values().stream().map(s -> new SupermarketAddress(s.getAddress(), supermarket.get(), pickupPointFromAddressHashMap.get(s.getPickupPointId()))).collect(Collectors.toList()));
//                supermarket.get().setSupermarketAddressList(supermarketAddressList);
//            }
//        }
//
//
//        if(errorFields.size() > 0){
//            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
//        }
//
//
//        return supermarket.get();
//    }


    @Override
    public Supermarket createSupermarketAddress(List<SupermarketAddressCreateBody> supermarketAddressCreateBody, UUID supermarketId) {

        HashMap<String,String> errorFields = new HashMap<>();
        HashMap<UUID, PickupPoint> pickupPointFromAddressHashMap = new HashMap<>();
        Optional<Supermarket> supermarket = supermarketRepository.findById(supermarketId);

        if(!supermarket.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.SUPERMARKET_NOT_FOUND.getCode()), AdditionalResponseCode.SUPERMARKET_NOT_FOUND.toString());
        }

        // validate all address in request
        HashMap<String, SupermarketAddressCreateBody> addressHashMap = new HashMap<>();
        supermarketAddressCreateBody.stream().forEach(s -> {
            if(!errorFields.containsKey("error")) {
                if(!addressHashMap.containsKey(s.getAddress().toUpperCase())){
                    addressHashMap.put(s.getAddress().toUpperCase(), s);
                } else {
                    errorFields.put("error", "Duplicate address found in request (" + s.getAddress() + ")");
                }
            }
        });

//        HashSet<String> addressHashSet = new HashSet<>();
//        addressHashSet.addAll(addressHashMap.values());

        if(!errorFields.containsKey("error")){
            List<String> duplicatedAddressTrackList = new ArrayList<>();
            supermarketAddressCreateBody.stream().forEach(s -> {
                if(supermarket.get().getSupermarketAddressList().stream()
                        .filter(supermarketAddress -> supermarketAddress.getAddress().toUpperCase().equals(s.getAddress().toUpperCase())).toList().size() > 0){
                    duplicatedAddressTrackList.add(s.getAddress());
                }
            });
            if(duplicatedAddressTrackList.size() > 0) {
                errorFields.put("error", duplicatedAddressTrackList.stream().map(s -> '"'+ s.toString() + '"').collect(Collectors.joining(", ")) + " is/are found in supermarket");
            }
        }

        if(!errorFields.containsKey("error")){
            List<PickupPoint> pickupPointFromAddressList = pickupPointRepository.getAllByIdList(addressHashMap.values().stream().map(s -> s.getPickupPointId()).collect(Collectors.toList()));
            // map pickPoint from address list to hashmap
            for (PickupPoint pickupPoint : pickupPointFromAddressList){
                pickupPointFromAddressHashMap.put(pickupPoint.getId(), pickupPoint);
            }
            // hashmap to track unfound pickup point
            HashMap<UUID, UUID> pickupPointNotFoundHashMap = new HashMap<>();
            for(SupermarketAddressCreateBody s : addressHashMap.values()) {
                // check pickup point
                if(!pickupPointFromAddressHashMap.containsKey(s.getPickupPointId())){
                    pickupPointNotFoundHashMap.put(s.getPickupPointId(),s.getPickupPointId());
//                    if(errorFields.containsKey("addressError")){
//                        String errorField = errorFields.get("addressError");
//                        errorField += errorFields.get("addressError") + "," + supermarketAddressCreateBody.getPickupPointId();
//                        errorFields.put("addressError", errorField);
//                    } else {
//                        errorFields.put("addressError", "No pickup point with id " + supermarketAddressCreateBody.getPickupPointId());
//                    }
                }
            }
            if(pickupPointNotFoundHashMap.size() > 0) {
                errorFields.put("error", "No pickup point with id " + pickupPointNotFoundHashMap.values().stream().collect(Collectors.toList()).stream()
                        .map(Object::toString).collect(Collectors.joining(",")));
            }
        }

        if(!errorFields.containsKey("error")) {
            for(SupermarketAddressCreateBody s : addressHashMap.values()) {
                if((s.getAddress().length() > 255 || s.getAddress().isBlank()) && !errorFields.containsKey("error")){
                    errorFields.put("error", "Address maximum character is 255 and can not be empty");
                }
            }
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        List<SupermarketAddress> supermarketAddressList = supermarketAddressRepository.saveAll(addressHashMap.values().stream().map(s -> new SupermarketAddress(s.getAddress(), supermarket.get(), pickupPointFromAddressHashMap.get(s.getPickupPointId()))).collect(Collectors.toList()));

        supermarket.get().getSupermarketAddressList().addAll(supermarketAddressList);

        return supermarket.get();
    }

    @Override
    @Transactional
    public Supermarket updateSupermarketAddress(SupermarketAddressUpdateBody supermarketAddressUpdateBody, UUID supermarketAddressId) {
        HashMap<String,String> errorFields = new HashMap<>();
        Optional<SupermarketAddress> supermarketAddress = supermarketAddressRepository.findById(supermarketAddressId);

        if(!supermarketAddress.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.SUPERMARKET_ADDRESS_NOT_FOUND.getCode()), AdditionalResponseCode.SUPERMARKET_ADDRESS_NOT_FOUND.toString());
        }

        Supermarket supermarket = supermarketRepository.findById(supermarketAddress.get().getSupermarket().getId()).get();

        if(supermarketAddressUpdateBody.getAddress() != null && !supermarketAddressUpdateBody.getAddress().isBlank()) {
            if(supermarket.getSupermarketAddressList().stream()
                    .filter(s -> !s.getId().equals(supermarketAddressId) && s.getAddress().toUpperCase().equals(supermarketAddressUpdateBody.getAddress().toUpperCase())).toList().size() > 0){
                errorFields.put("addressError", "Address is found in supermarket");
            }
            if((supermarketAddressUpdateBody.getAddress().length() > 255 || supermarketAddressUpdateBody.getAddress().isBlank())){
                errorFields.put("addressError", "Maximum character is 255 and can not be empty");
            }
            if(!errorFields.containsKey("addressError")){
                supermarketAddress.get().setAddress(supermarketAddressUpdateBody.getAddress());
            }
        }

        if(supermarketAddressUpdateBody.getPickupPointId() != null) {
            Optional<PickupPoint> pickupPointTrack = pickupPointRepository.findById(supermarketAddressUpdateBody.getPickupPointId());
            if(!pickupPointTrack.isPresent()){
                errorFields.put("pickupPointError", "Pick up point not found ");
            } else {
                supermarketAddress.get().setPickupPoint(pickupPointTrack.get());
            }
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        for (SupermarketAddress s : supermarket.getSupermarketAddressList()) {
            if(s.getId().equals(supermarketAddress.get().getId())){
                s.setAddress(supermarketAddress.get().getAddress());
                s.setPickupPoint(supermarketAddress.get().getPickupPoint());
            }
        }

        return supermarket;
    }

    @Override
    @Transactional
    public Supermarket deleteSupermarketAddress(UUID supermarketAddressId) {
        Optional<SupermarketAddress> supermarketAddress = supermarketAddressRepository.findById(supermarketAddressId);

        if(!supermarketAddress.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.SUPERMARKET_ADDRESS_NOT_FOUND.getCode()), AdditionalResponseCode.SUPERMARKET_ADDRESS_NOT_FOUND.toString());
        }

        List<ProductBatch> existedProductBatchList = productBatchRepository.getProductBatchBySupermarketAddress(supermarketAddressId, PageRequest.of(0,1));

        if(existedProductBatchList.size() > 0){
            throw new DeleteSuperMarketAddressForbiddenException(HttpStatus.valueOf(AdditionalResponseCode.SUPERMARKET_ADDRESS_IN_PRODUCT_BATCH.getCode()), AdditionalResponseCode.SUPERMARKET_ADDRESS_IN_PRODUCT_BATCH.toString());
        }

        Supermarket supermarket = supermarketRepository.findById(supermarketAddress.get().getSupermarket().getId()).get();
        supermarket.getSupermarketAddressList().removeIf(s -> s.getId().equals(supermarketAddressId));
        supermarketAddressRepository.delete(supermarketAddress.get());

        return supermarket;
    }

    @Override
    @Transactional
    public Supermarket changeStatus(UUID supermarketId, EnableDisableStatus status) {
        Optional<Supermarket> supermarket = supermarketRepository.findById(supermarketId);

        if(!supermarket.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.SUPERMARKET_NOT_FOUND.getCode()), AdditionalResponseCode.SUPERMARKET_NOT_FOUND.toString());
        }

        if(status.toString().equals(EnableDisableStatus.ENABLE.toString())){
            supermarket.get().setStatus(status.ordinal());
        }
        if(status.toString().equals(EnableDisableStatus.DISABLE.toString())){
            Product product = productRepository.getProductByActiveAndSupermarketId(supermarketId, PageRequest.of(0,1));
            if(product!=null){
                throw new DisableSupermarketForbidden(HttpStatus.valueOf(AdditionalResponseCode.DISABLE_SUPERMARKET_FORBIDDEN.getCode()), AdditionalResponseCode.DISABLE_SUPERMARKET_FORBIDDEN.toString());
            }
            supermarket.get().setStatus(status.ordinal());
        }
        return supermarket.get();
    }

    @Override
    public SupermarketListResponseBody getSupermarketForStaff(String name, EnableDisableStatus status, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Supermarket> result = supermarketRepository.getSupermarketForStaff(name, status == null ? EnableDisableStatus.ENABLE.ordinal() : status.ordinal(), pageable);
        int totalPage = result.getTotalPages();
        long totalSupermarket = result.getTotalElements();
        List<Supermarket> supermarketList = result.stream().toList();
        return new SupermarketListResponseBody(supermarketList, totalPage, totalSupermarket);
    }


}
