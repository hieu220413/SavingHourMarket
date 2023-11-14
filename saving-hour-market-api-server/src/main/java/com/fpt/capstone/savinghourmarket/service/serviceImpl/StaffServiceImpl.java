package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.*;
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
import org.redisson.misc.Hash;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
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

    private final TimeFrameRepository timeFrameRepository;

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
    @Transactional
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
        staff.get().setRole(staffRoleUpdateRequestBody.getRole().toString());
        claims.put("user_role", staffRoleUpdateRequestBody.getRole().toString());
        firebaseAuth.setCustomUserClaims(userRecord.getUid(), claims);
        firebaseAuth.revokeRefreshTokens(userRecord.getUid());

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

    @Override
    public StaffListResponseBody getStaffForDeliverManager(String name, OrderType orderType, LocalDate deliverDate, UUID timeFrameId) {
        if(orderType == null) {
            orderType = OrderType.SINGLE;
        }

        Optional<TimeFrame> timeFrame = timeFrameRepository.findById(timeFrameId);
         if(!timeFrame.isPresent()) {
             throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.TIME_FRAME_NOT_FOUND.getCode()), AdditionalResponseCode.TIME_FRAME_NOT_FOUND.toString());
         }

        List<Staff> staffList = staffRepository.getAllStaffForDeliverManager(name, StaffRole.STAFF_DLV_0.toString());
        HashMap<UUID, Staff> staffHashMap = new HashMap();
        for (Staff staff : staffList) {
            staffHashMap.put(staff.getId(), staff);
        }

         // check collide with order group
        List<Staff> removeStaffList = staffRepository.getStaffWithDeliverDateAndTimeFrame(name, StaffRole.STAFF_DLV_0.toString(), deliverDate, timeFrame.get().getFromHour(), timeFrame.get().getToHour());
        HashMap<UUID, Staff> removeStaffHashMap = new HashMap<>();
        for (Staff removeStaff : removeStaffList) {
            removeStaffHashMap.put(removeStaff.getId(), removeStaff);
        }

        if(orderType.ordinal() == OrderType.ORDER_GROUP.ordinal()) {
            // check collide with order batch
            List<Staff> removeStaffByDoorToDoorOrderList = staffRepository.getStaffWithDeliverDateAndTimeFrameByDoorToDoorOrder(name, StaffRole.STAFF_DLV_0.toString(), deliverDate, timeFrame.get().getFromHour(), timeFrame.get().getToHour());
            for (Staff removeStaffByDoorToDoorOrder : removeStaffByDoorToDoorOrderList) {
                if(!removeStaffHashMap.containsKey(removeStaffByDoorToDoorOrder.getId())) {
                    removeStaffHashMap.put(removeStaffByDoorToDoorOrder.getId(), removeStaffByDoorToDoorOrder);
                    removeStaffList.add(removeStaffByDoorToDoorOrder);
                }
            }
        }

        for (Staff removeStaff : removeStaffList) {
            staffList.removeIf(staff -> removeStaff.getId() == staff.getId());
            staffHashMap.remove(removeStaff.getId());
        }

        if(orderType.ordinal() == OrderType.ORDER_BATCH.ordinal()) {
            List<Object[]> countCollideBatchForStaffList =  staffRepository.countCollideBatchForStaff(staffList.stream().map(staff -> staff.getId()).collect(Collectors.toList()), deliverDate, timeFrame.get().getFromHour(), timeFrame.get().getToHour());
            for(Object[] countCollideBatchForStaff : countCollideBatchForStaffList) {
                UUID staffIdResult = (UUID) countCollideBatchForStaff[0];
                Long collideBatchCountResult = (Long) countCollideBatchForStaff[1];
                staffHashMap.get(staffIdResult).setCollideOrderBatchQuantity(collideBatchCountResult);
            }
            for (Staff staff : staffList) {
                if(staff.getCollideOrderBatchQuantity() == null) {
                    staff.setCollideOrderBatchQuantity(Long.parseLong("0"));
                }
            }
        }

//        Pageable pageable = PageRequest.of(page, limit);

//        if(orderType.ordinal() == OrderType.ORDER_GROUP.ordinal()){
        // find deliver that have group which collide with current

//        }
//        List<Staff> result = staffRepository.getStaffForDeliverManager(name, StaffRole.STAFF_DLV_0.toString(), orderType.ordinal(), deliverDate, timeFrameId);
//        int totalPage = result.getTotalPages();
//        long totalCustomer = result.getTotalElements();

        return new StaffListResponseBody(staffList, null, null);
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
