package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.common.StaffRole;
import com.fpt.capstone.savinghourmarket.entity.*;
import com.fpt.capstone.savinghourmarket.exception.*;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.repository.*;
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
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;

    private final PickupPointRepository pickupPointRepository;

    private final CustomerRepository customerRepository;

    private final OrderRepository orderRepository;

    private final FirebaseAuth firebaseAuth;

    private final OrderBatchRepository orderBatchRepository;

    private final OrderGroupRepository orderGroupRepositorys;

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
    public StaffListResponseBody getStaffForAdmin(String name, StaffRole role, EnableDisableStatus status, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Staff> result = staffRepository.getStaffForAdmin(name, role == null ? null : role.toString(), status == null ? null : status.ordinal(), pageable);
        int totalPage = result.getTotalPages();
        long totalCustomer = result.getTotalElements();

        List<Staff> staffList = result.stream().toList();

        return new StaffListResponseBody(staffList, totalPage, totalCustomer);
    }

    @Override
    @Transactional(rollbackFor = FirebaseAuthException.class)
    public Staff updateStaffAccountStatus(AccountStatusChangeBody accountStatusChangeBody, String email) throws FirebaseAuthException {
        Optional<Staff> staff = staffRepository.findById(accountStatusChangeBody.getAccountId());

        if(!staff.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_NOT_FOUND.getCode()), AdditionalResponseCode.STAFF_NOT_FOUND.toString());
        }

        if(staff.get().getEmail().equals(email)){
            throw new SelfStatusChangeNotAllowedException(HttpStatus.valueOf(AdditionalResponseCode.SELF_STATUS_CHANGE_NOT_ALLOWED.getCode()), AdditionalResponseCode.SELF_STATUS_CHANGE_NOT_ALLOWED.toString());
        }

        if(accountStatusChangeBody.getEnableDisableStatus().ordinal() == EnableDisableStatus.ENABLE.ordinal()){
            staff.get().setStatus(EnableDisableStatus.ENABLE.ordinal());
            UserRecord userRecord = firebaseAuth.getUserByEmail(staff.get().getEmail());
            UserRecord.UpdateRequest updateRequest = new UserRecord.UpdateRequest(userRecord.getUid()).setDisabled(false);
            firebaseAuth.updateUser(updateRequest);
        } else {
            UserRecord userRecord = checkIsStaffInOrderProcess(staff);
            staff.get().setStatus(EnableDisableStatus.DISABLE.ordinal());
            UserRecord.UpdateRequest updateRequest = new UserRecord.UpdateRequest(userRecord.getUid()).setDisabled(true);
            firebaseAuth.updateUser(updateRequest);
            firebaseAuth.revokeRefreshTokens(userRecord.getUid());
        }
        return staff.get();
    }

    @Override
    public Staff updateStaffRole(StaffRoleUpdateRequestBody staffRoleUpdateRequestBody, String email) throws FirebaseAuthException {
        Optional<Staff> staff = staffRepository.findById(staffRoleUpdateRequestBody.getId());

        if(!staff.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_NOT_FOUND.getCode()), AdditionalResponseCode.STAFF_NOT_FOUND.toString());
        }

        if(staff.get().getEmail().equals(email)){
            throw new SelfRoleChangeNotAllowedException(HttpStatus.valueOf(AdditionalResponseCode.SELF_ROLE_CHANGE_NOT_ALLOWED.getCode()), AdditionalResponseCode.SELF_ROLE_CHANGE_NOT_ALLOWED.toString());
        }

        UserRecord userRecord = checkIsStaffInOrderProcess(staff);

        Map<String, Object> claims = new HashMap<>();
        claims.put("user_role", staffRoleUpdateRequestBody.getRole().toString());
        firebaseAuth.setCustomUserClaims(userRecord.getUid(), claims);
        staff.get().setRole(staffRoleUpdateRequestBody.getRole().toString());

        return staff.get();
    }

    @Override
    @Transactional
    public Staff assignPickupPoint(StaffPickupPointAssignmentBody staffPickupPointAssignmentBody) {
        Optional<Staff> staff = staffRepository.findByEmail(staffPickupPointAssignmentBody.getStaffEmail());
        if(!staff.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_NOT_FOUND.getCode()), AdditionalResponseCode.STAFF_NOT_FOUND.toString());
        }

        Optional<PickupPoint> pickupPoint = pickupPointRepository.findById(staffPickupPointAssignmentBody.getPickupPointId());
        if(!pickupPoint.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.getCode()), AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.toString());
        }

        if(staff.get().getPickupPoint().stream().filter(pickupPoint1 -> pickupPoint1.getId().equals(pickupPoint.get().getId())).collect(Collectors.toList()).size() == 0){
            staff.get().getPickupPoint().add(pickupPoint.get());
        }

        return staff.get();
    }

    @Override
    @Transactional
    public Staff unAssignPickupPoint(StaffPickupPointAssignmentBody staffPickupPointAssignmentBody) {
        Optional<Staff> staff = staffRepository.findByEmail(staffPickupPointAssignmentBody.getStaffEmail());
        if(!staff.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_NOT_FOUND.getCode()), AdditionalResponseCode.STAFF_NOT_FOUND.toString());
        }

        Optional<PickupPoint> pickupPoint = pickupPointRepository.findById(staffPickupPointAssignmentBody.getPickupPointId());
        if(!pickupPoint.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.getCode()), AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.toString());
        }

        staff.get().getPickupPoint().removeIf(pickupPoint1 -> pickupPoint1.getId().equals(pickupPoint.get().getId()));

        return staff.get();
    }

    private UserRecord checkIsStaffInOrderProcess(Optional<Staff> staff) throws FirebaseAuthException {
        UserRecord userRecord = firebaseAuth.getUserByEmail(staff.get().getEmail());
        String staffRole = (String) userRecord.getCustomClaims().get("user_role");

        if(StaffRole.STAFF_ORD.toString().equals(staffRole)){
            List<Order> processingOrderList = orderRepository.findStaffProcessingOrderById(staff.get().getId(), PageRequest.of(0,1), List.of(OrderStatus.PROCESSING.ordinal(), OrderStatus.DELIVERING.ordinal(), OrderStatus.PACKAGING.ordinal(), OrderStatus.PACKAGED.ordinal()));
            if(processingOrderList.size() > 0){
                throw new DisableStaffForbiddenException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_IS_IN_PROCESSING_ORDER.getCode()), AdditionalResponseCode.STAFF_IS_IN_PROCESSING_ORDER.toString());
            }
        }

        if(StaffRole.STAFF_DLV_1.toString().equals(staffRole) || StaffRole.STAFF_DLV_0.toString().equals(staffRole)) {
            List<OrderBatch> processingUpcomingBatch = orderBatchRepository.findStaffUpcomingOrderBatchById(staff.get().getId(), PageRequest.of(0,1));
            List<OrderGroup> processingUpcomingOrderGroup = orderGroupRepositorys.findStaffUpcomingOrderGroupById(staff.get().getId(), PageRequest.of(0,1), LocalTime.now());
            if(processingUpcomingBatch.size() > 0 || processingUpcomingOrderGroup.size() > 0) {
                throw new DisableStaffForbiddenException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_IS_IN_PROCESSING_ORDER.getCode()), AdditionalResponseCode.STAFF_IS_IN_PROCESSING_ORDER.toString());
            }
        }

        return userRecord;
    }
}
