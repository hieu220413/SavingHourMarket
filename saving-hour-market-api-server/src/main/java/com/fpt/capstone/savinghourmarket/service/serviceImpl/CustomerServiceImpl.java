package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.Staff;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.StaffAccessForbiddenException;
import com.fpt.capstone.savinghourmarket.model.CustomerListResponseBody;
import com.fpt.capstone.savinghourmarket.model.PasswordRequestBody;
import com.fpt.capstone.savinghourmarket.model.CustomerRegisterRequestBody;
import com.fpt.capstone.savinghourmarket.model.CustomerUpdateRequestBody;
import com.fpt.capstone.savinghourmarket.repository.CustomerRepository;
import com.fpt.capstone.savinghourmarket.repository.StaffRepository;
import com.fpt.capstone.savinghourmarket.service.CustomerService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserInfo;
import com.google.firebase.auth.UserRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final FirebaseAuth firebaseAuth;

    private final CustomerRepository customerRepository;

    private final StaffRepository staffRepository;

    @Override
    public String register(CustomerRegisterRequestBody customerRegisterRequestBody) throws FirebaseAuthException, UnsupportedEncodingException {
        Pattern pattern;
        Matcher matcher;
        HashMap errorFields = new HashMap<>();

        // email format validate
        pattern = Pattern.compile("^[\\w!#$%&amp;'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&amp;'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$");
        matcher = pattern.matcher(customerRegisterRequestBody.getEmail());
        if(!matcher.matches()){
            errorFields.put("emailError", "Invalid email format");
        }

        // password validate
        pattern = Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$");
        matcher = pattern.matcher(customerRegisterRequestBody.getPassword());

        if(!matcher.matches()){
            errorFields.put("passwordError", "At least 8 characters, 1 digit, 1 uppercase and lowercase letter");
        }

        // email duplicate validate
        if(customerRepository.getCustomerByEmail(customerRegisterRequestBody.getEmail().trim()).isPresent() || staffRepository.findByEmail(customerRegisterRequestBody.getEmail().trim()).isPresent()){
            errorFields.put("emailError", "This email has already been registered");
        }

        //phone format validate
//        pattern = Pattern.compile("^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$");
//        matcher = pattern.matcher(customerRegisterRequestBody.getPhone());
//        if(!matcher.matches()){
//            errorFields.put("phoneError", "Invalid phone number format");
//        }

        //full name validate
//        pattern = Pattern.compile("^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$");
//        matcher = pattern.matcher(customerRegisterRequestBody.getFullName());
//        if(!matcher.matches()){
//            errorFields.put("fullNameError", "Contain only alphabet en/vn and space. Minimum characters is 2 and maximum is 50");
//        }

//        if(customerRegisterRequestBody.getAddress().length() > 255){
//            errorFields.put("addressError", "Maximum character is 255");
//        }

//        if(customerRegisterRequestBody.getGender() != 1 && customerRegisterRequestBody.getGender() != 0) {
//            errorFields.put("genderError", "Accept only 1 (Female) and 0 (Male)");
//        }

//        try {
//            LocalDate localDate = LocalDate.parse(customerRegisterRequestBody.getDateOfBirth());
//        } catch (Exception e) {
//            errorFields.put("dateOfBirthError", "Invalid date or date format");
//        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(customerRegisterRequestBody.getEmail())
                .setEmailVerified(false)
                .setPassword(customerRegisterRequestBody.getPassword());

        UserRecord userRecord = firebaseAuth.createUser(request);

        String customToken = firebaseAuth.createCustomToken(userRecord.getUid());

//        if(customerRegisterRequestBody.getAvatarUrl() == null) customerRegisterRequestBody.setAvatarUrl("");

        Customer customerEntity = new Customer(customerRegisterRequestBody);

        customerRepository.save(customerEntity);

        return customToken;

    }

    @Override
    public Customer getInfoGoogleLogged(String email) throws FirebaseAuthException {
        Optional<Customer> customer = customerRepository.getCustomerByEmail(email);
        Optional<Staff> staff = staffRepository.getStaffByEmail(email);
        if(staff.isPresent()){
            throw new StaffAccessForbiddenException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_ACCESS_FORBIDDEN.getCode()), AdditionalResponseCode.STAFF_ACCESS_FORBIDDEN.toString());
        }
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
        Optional<Staff> staff = staffRepository.getStaffByEmail(email);
        if(staff.isPresent()) {
            throw new StaffAccessForbiddenException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_ACCESS_FORBIDDEN.getCode()), AdditionalResponseCode.STAFF_ACCESS_FORBIDDEN.toString());
        }
        Optional<Customer> customer = customerRepository.getCustomerByEmail(email);
        return customer.get();
    }

    @Override
    @Transactional
    public Customer updateInfo(CustomerUpdateRequestBody customerUpdateRequestBody, String email) throws IOException {
        Pattern pattern;
        Matcher matcher;
        HashMap errorFields = new HashMap<>();
//        Customer newCustomerField = new Customer();
        Optional<Customer> targetedCustomer = customerRepository.getCustomerByEmail(email);

        if(!targetedCustomer.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.CUSTOMER_NOT_FOUND.getCode()), AdditionalResponseCode.CUSTOMER_NOT_FOUND.toString());
        }

        //phone format validate
        if(customerUpdateRequestBody.getPhone()!=null && !customerUpdateRequestBody.getPhone().isBlank()) {
            pattern = Pattern.compile("^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$");
            matcher = pattern.matcher(customerUpdateRequestBody.getPhone());
            if(!matcher.matches()){
                errorFields.put("phoneError", "Invalid phone number format");
            } else {
                targetedCustomer.get().setPhone(customerUpdateRequestBody.getPhone());
            }
        }


        //full name validate
        if(customerUpdateRequestBody.getFullName()!=null && !customerUpdateRequestBody.getFullName().isBlank()) {
            pattern = Pattern.compile("^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$");
            matcher = pattern.matcher(customerUpdateRequestBody.getFullName());
            if(!matcher.matches()){
                errorFields.put("fullNameError", "Contain only alphabet en/vn and space. Minimum characters is 2 and maximum is 50");
            } else {
                targetedCustomer.get().setFullName(customerUpdateRequestBody.getFullName());
            }

        }

        if(customerUpdateRequestBody.getAddress()!=null && !customerUpdateRequestBody.getAddress().isBlank()){
            if(customerUpdateRequestBody.getAddress().length() > 255){
                errorFields.put("addressError", "Maximum character is 255");
            } else {
                targetedCustomer.get().setAddress(customerUpdateRequestBody.getAddress());
            }
        }

        if(customerUpdateRequestBody.getGender()!=null) {
            if(customerUpdateRequestBody.getGender() != 1 && customerUpdateRequestBody.getGender() != 0){
                errorFields.put("genderError", "Accept only 1 (Female) and 0 (Male)");
            } else {
                targetedCustomer.get().setGender(customerUpdateRequestBody.getGender());
            }

        }


        if(customerUpdateRequestBody.getDateOfBirth()!=null){
            try {
                LocalDate localDate = LocalDate.parse(customerUpdateRequestBody.getDateOfBirth());
                targetedCustomer.get().setDateOfBirth(localDate);
            } catch (Exception e) {
                errorFields.put("dateOfBirthError", "Invalid date or date format");
            }
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        if(customerUpdateRequestBody.getAvatarUrl()!= null && !customerUpdateRequestBody.getAvatarUrl().isBlank()){
            targetedCustomer.get().setAvatarUrl(customerUpdateRequestBody.getAvatarUrl());
        }

//        if(imageFile != null && !imageFile.isEmpty()){
//            String imageUrl = Utils.uploadPublicFileToFirebaseStorage(imageFile);
//            targetedCustomer.get().setAvatarUrl(imageUrl);
//        }

//        Customer result = customerRepository.save(targetedCustomer.get());

        return targetedCustomer.get();
    }

    @Override
    public void updatePassword(PasswordRequestBody passwordRequestBody, String email) throws FirebaseAuthException {
        Pattern pattern;
        Matcher matcher;
        HashMap errorFields = new HashMap<>();

        // password validate
        pattern = Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$");
        matcher = pattern.matcher(passwordRequestBody.getPassword());

        if(!matcher.matches()){
            errorFields.put("passwordError", "At least 8 characters, 1 digit, 1 uppercase and lowercase letter");
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        String uid = firebaseAuth.getUserByEmail(email).getUid();
        UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(uid)
                .setPassword(passwordRequestBody.getPassword());
        firebaseAuth.updateUser(request);
        firebaseAuth.revokeRefreshTokens(uid);
    }

    @Override
    public CustomerListResponseBody getCustomerForAdmin(String name, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Customer> result = customerRepository.getCustomerForAdmin(name, pageable);
        int totalPage = result.getTotalPages();
        long totalCustomer = result.getTotalElements();

        List<Customer> customerList = result.stream().toList();

        return new CustomerListResponseBody(customerList, totalPage, totalCustomer);
    }
}
