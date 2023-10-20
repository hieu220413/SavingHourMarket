package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.StaffRole;
import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.entity.Staff;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.model.CustomerListResponseBody;
import com.fpt.capstone.savinghourmarket.model.StaffCreateRequestBody;
import com.fpt.capstone.savinghourmarket.model.StaffListResponseBody;
import com.fpt.capstone.savinghourmarket.model.StaffUpdateRequestBody;
import com.fpt.capstone.savinghourmarket.repository.CustomerRepository;
import com.fpt.capstone.savinghourmarket.repository.StaffRepository;
import com.fpt.capstone.savinghourmarket.service.StaffService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;

    private final CustomerRepository customerRepository;

    private final FirebaseAuth firebaseAuth;

//    @Override
//    public Staff getInfoGoogleLogged(String email) throws FirebaseAuthException {
//        Optional<Staff> staff = staffRepository.findByEmail(email);
//        if(!staff.isPresent()){
//            UserInfo userInfo = firebaseAuth.getUserByEmail(email);
//            Staff newStaff = new Staff();
//            newStaff.setEmail(userInfo.getEmail());
//            newStaff.setAvatarUrl(userInfo.getPhotoUrl());
//            newStaff.setFullName(userInfo.getDisplayName());
//            newStaff.setStatus(EnableDisableStatus.ENABLE.ordinal());
//            return staffRepository.save(newStaff);
//        }
//        return staff.get();
//    }

    @Override
    public Staff getInfo(String email) {
        Optional<Staff> staff = staffRepository.findByEmail(email);
        return staff.get();
    }


    @Override
    @Transactional
    public Staff updateInfo(StaffUpdateRequestBody staffUpdateRequestBody, String email, MultipartFile imageFile) throws IOException {
        Pattern pattern;
        Matcher matcher;
        HashMap errorFields = new HashMap<>();

        Optional<Staff> targetedStaff = staffRepository.findByEmail(email);

        //full name validate
        if(staffUpdateRequestBody.getFullName()!=null && !staffUpdateRequestBody.getFullName().isBlank()) {
            pattern = Pattern.compile("^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$");
            matcher = pattern.matcher(staffUpdateRequestBody.getFullName());
            if(!matcher.matches()){
                errorFields.put("fullNameError", "Contain only alphabet en/vn and space. Minimum characters is 2 and maximum is 50");
            } else {
                targetedStaff.get().setFullName(staffUpdateRequestBody.getFullName());
            }

        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        if(imageFile != null && !imageFile.isEmpty()){
            String imageUrl = Utils.uploadPublicFileToFirebaseStorage(imageFile);
            targetedStaff.get().setAvatarUrl(imageUrl);
        }

        return targetedStaff.get();
    }

    @Override
    public Customer getCustomerDetailByEmail(String email) {
        Optional<Customer> customer = customerRepository.getCustomerByEmail(email);
        if(!customer.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.CUSTOMER_NOT_FOUND.getCode()), AdditionalResponseCode.CUSTOMER_NOT_FOUND.toString());
        }
        return customer.get();
    }

    @Override
    public Staff createStaffAccount(StaffCreateRequestBody staffCreateRequestBody, StaffRole role) throws FirebaseAuthException, UnsupportedEncodingException {
        Pattern pattern;
        Matcher matcher;
        HashMap errorFields = new HashMap<>();

        // email format validate
        pattern = Pattern.compile("^[\\w!#$%&amp;'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&amp;'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$");
        matcher = pattern.matcher(staffCreateRequestBody.getEmail());
        if(!matcher.matches()){
            errorFields.put("emailError", "Invalid email format");
        }

        // password validate
        pattern = Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$");
        matcher = pattern.matcher(staffCreateRequestBody.getPassword());

        if(!matcher.matches()){
            errorFields.put("passwordError", "At least 8 characters, 1 digit, 1 uppercase and lowercase letter");
        }

        // email duplicate validate
        if(staffRepository.findByEmail(staffCreateRequestBody.getEmail().trim()).isPresent()){
            errorFields.put("emailError", "This email has already been registered");
        }

        pattern = Pattern.compile("^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$");
        matcher = pattern.matcher(staffCreateRequestBody.getFullName());
        if(!matcher.matches()){
            errorFields.put("fullNameError", "Contain only alphabet en/vn and space. Minimum characters is 2 and maximum is 50");
        }



        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }


        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(staffCreateRequestBody.getEmail())
                .setEmailVerified(true)
                .setPassword(staffCreateRequestBody.getPassword());

        UserRecord staffNewAccount = firebaseAuth.createUser(request);

        Map<String, Object> claims = new HashMap<>();
        claims.put("user_role", role.toString());
        firebaseAuth.setCustomUserClaims(staffNewAccount.getUid(), claims);

        Staff staff = new Staff(staffCreateRequestBody, role);

        return staffRepository.save(staff);
    }

    @Override
    public Staff getStaffByEmail(String email) {
        Optional<Staff> staff = staffRepository.findByEmail(email);
        if(!staff.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_NOT_FOUND.getCode()), AdditionalResponseCode.STAFF_NOT_FOUND.toString());
        }
        return staff.get();
    }

    @Override
    public StaffListResponseBody getStaffForAdmin(String name, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Staff> result = staffRepository.getStaffForAdmin(name, pageable);
        int totalPage = result.getTotalPages();
        long totalCustomer = result.getTotalElements();

        List<Staff> staffList = result.stream().toList();

        return new StaffListResponseBody(staffList, totalPage, totalCustomer);
    }
}
