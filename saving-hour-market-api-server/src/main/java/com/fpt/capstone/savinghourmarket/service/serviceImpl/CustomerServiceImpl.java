package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.exception.InvalidUserInputException;
import com.fpt.capstone.savinghourmarket.model.CustomerRegisterRequestBody;
import com.fpt.capstone.savinghourmarket.repository.CustomerRepository;
import com.fpt.capstone.savinghourmarket.service.CustomerService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserInfo;
import com.google.firebase.auth.UserRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final FirebaseAuth firebaseAuth;

    private final CustomerRepository customerRepository;

    private HashMap errorFields = new HashMap<>();

    @Override
    public Customer register(CustomerRegisterRequestBody customerRegisterRequestBody) throws FirebaseAuthException {
        Pattern pattern;
        Matcher matcher;

        // email format validate
        pattern = Pattern.compile("^[\\w!#$%&amp;'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&amp;'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$");
        matcher = pattern.matcher(customerRegisterRequestBody.getEmail());
        if(!matcher.matches()){
            errorFields.put("emailError", "Invalid email format");
        }

        pattern = Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$");
        matcher = pattern.matcher(customerRegisterRequestBody.getPassword());

        if(!matcher.matches()){
            errorFields.put("passwordError", "At least 8 characters, 1 digit, 1 uppercase and lowercase letter");
        }

        // email duplicate validate
        if(customerRepository.getCustomerByEmail(customerRegisterRequestBody.getEmail().trim()).isPresent()){
            errorFields.put("emailError", "This email has already been registered");
        }

        //phone format validate
        pattern = Pattern.compile("^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$");
        matcher = pattern.matcher(customerRegisterRequestBody.getPhone());
        if(!matcher.matches()){
            errorFields.put("phoneError", "Invalid phone number format");
        }

        //full name validate
        pattern = Pattern.compile("^[A-Za-z\s]{2,50}$");
        matcher = pattern.matcher(customerRegisterRequestBody.getFullName());
        if(!matcher.matches()){
            errorFields.put("fullNameError", "Contain only alphabet and space. Minimum characters is 2 and maximum is 50");
        }

        if(customerRegisterRequestBody.getAddress().length() > 255){
            errorFields.put("addressError", "Maximum character is 255");
        }

        if(customerRegisterRequestBody.getGender() != 1 && customerRegisterRequestBody.getGender() != 0) {
            errorFields.put("genderError", "Accept only 1 (Female) and 0 (Male)");
        }

        try {
            LocalDate localDate = LocalDate.parse(customerRegisterRequestBody.getDateOfBirth());
        } catch (Exception e) {
            errorFields.put("dateOfBirthError", "Invalid date or date format");
        }

        if(errorFields.size() > 0){
            throw new InvalidUserInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(customerRegisterRequestBody.getEmail())
                .setEmailVerified(false)
                .setPassword(customerRegisterRequestBody.getPassword());

        firebaseAuth.createUser(request);

        if(customerRegisterRequestBody.getAvatarUrl() == null) customerRegisterRequestBody.setAvatarUrl("");

        Customer customerEntity = new Customer(customerRegisterRequestBody);

        return customerRepository.save(customerEntity);

    }

    @Override
    public Customer getInfoGoogleLogged(String email) throws FirebaseAuthException {
        Optional<Customer> customer = customerRepository.getCustomerByEmail(email);
        if(!customer.isPresent()){
            UserInfo userInfo = firebaseAuth.getUserByEmail(email);
            Customer newCustomer = new Customer();
            newCustomer.setEmail(userInfo.getEmail());
            newCustomer.setAvatarUrl(userInfo.getPhotoUrl());
            newCustomer.setFullName(userInfo.getDisplayName());
            newCustomer.setStatus(EnableDisableStatus.ENABLE.ordinal());
            return customerRepository.save(newCustomer);
        }
        return customer.get();
    }

    @Override
    public Customer getInfo(String email) {
        Optional<Customer> customer = customerRepository.getCustomerByEmail(email);
        return customer.get();
    }
}
