package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import com.fpt.capstone.savinghourmarket.exception.InvalidUserInputException;
import com.fpt.capstone.savinghourmarket.model.SupermarketCreateRequestBody;
import com.fpt.capstone.savinghourmarket.repository.SupermarketRepository;
import com.fpt.capstone.savinghourmarket.service.SupermarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class SupermarketServiceImpl implements SupermarketService {

    private final SupermarketRepository supermarketRepository;

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
            throw new InvalidUserInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        Supermarket supermarket = new Supermarket(supermarketCreateRequestBody);

        return supermarketRepository.save(supermarket);
    }
}
