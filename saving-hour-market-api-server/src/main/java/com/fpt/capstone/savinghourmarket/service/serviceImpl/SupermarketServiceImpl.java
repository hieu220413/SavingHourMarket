package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import com.fpt.capstone.savinghourmarket.exception.DisableSupermarketForbidden;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.model.SupermarketCreateRequestBody;
import com.fpt.capstone.savinghourmarket.model.SupermarketUpdateRequestBody;
import com.fpt.capstone.savinghourmarket.repository.ProductRepository;
import com.fpt.capstone.savinghourmarket.repository.SupermarketRepository;
import com.fpt.capstone.savinghourmarket.service.SupermarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class SupermarketServiceImpl implements SupermarketService {

    private final SupermarketRepository supermarketRepository;

    private final ProductRepository productRepository;

    @Override
    public Supermarket create(SupermarketCreateRequestBody supermarketCreateRequestBody) {
        Pattern pattern;
        Matcher matcher;
        HashMap errorFields = new HashMap<>();

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

        if(supermarketCreateRequestBody.getAddress().length() > 255 || supermarketCreateRequestBody.getAddress().isBlank()){
            errorFields.put("addressError", "Maximum character is 255 and can not be empty");
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        Supermarket supermarket = new Supermarket(supermarketCreateRequestBody);

        return supermarketRepository.save(supermarket);
    }

    @Override
    @Transactional
    public Supermarket update(SupermarketUpdateRequestBody supermarketUpdateRequestBody, UUID supermarketId) {
        Pattern pattern;
        Matcher matcher;
        HashMap errorFields = new HashMap<>();
        Optional<Supermarket> supermarket = supermarketRepository.findById(supermarketId);

        if(!supermarket.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.SUPERMARKET_NOT_FOUND.getCode()), AdditionalResponseCode.SUPERMARKET_NOT_FOUND.toString());
        }


        //name validate
        if(supermarketUpdateRequestBody.getName() != null && !supermarketUpdateRequestBody.getName().isBlank()){
            if(supermarketUpdateRequestBody.getName().trim().length() < 2 || supermarketUpdateRequestBody.getName().trim().length() > 50){
                errorFields.put("nameError", "Minimum character is 2 and maximum characters is 50");
            }
            if(supermarketRepository.findByName(supermarketUpdateRequestBody.getName().trim()).isPresent()) {
                errorFields.put("nameError", "Duplicate supermarket name");
            }
            if(!errorFields.containsKey("nameError")){
                supermarket.get().setName(supermarketUpdateRequestBody.getName());
            }
        }


        //duplicate name check

        //phone format validate
        if(supermarketUpdateRequestBody.getPhone() != null && !supermarketUpdateRequestBody.getPhone().isBlank()){
            pattern = Pattern.compile("^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$");
            matcher = pattern.matcher(supermarketUpdateRequestBody.getPhone());
            if(!matcher.matches()){
                errorFields.put("phoneError", "Invalid phone number format");
            } else {
                supermarket.get().setAddress(supermarketUpdateRequestBody.getPhone());
            }
        }

        if(supermarketUpdateRequestBody.getAddress() != null && !supermarketUpdateRequestBody.getAddress().isBlank()){
            if(supermarketUpdateRequestBody.getAddress().length() > 255 || supermarketUpdateRequestBody.getAddress().isBlank()){
                errorFields.put("addressError", "Maximum character is 255 and can not be empty");
            } else {
                supermarket.get().setAddress(supermarketUpdateRequestBody.getAddress());
            }
        }


        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }


        return supermarket.get();
    }

    @Override
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
}
