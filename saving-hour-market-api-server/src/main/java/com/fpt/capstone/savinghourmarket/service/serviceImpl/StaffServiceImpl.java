package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.*;
import com.fpt.capstone.savinghourmarket.entity.*;
import com.fpt.capstone.savinghourmarket.exception.*;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.repository.*;
import com.fpt.capstone.savinghourmarket.service.StaffService;
import com.fpt.capstone.savinghourmarket.service.SystemConfigurationService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import lombok.RequiredArgsConstructor;
import org.apache.commons.math3.util.Precision;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.DecimalFormat;
import java.time.Duration;
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

    private final SystemConfigurationService systemConfigurationService;

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
        pattern = Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$");
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
    public StaffListForAdminResponseBody getStaffForAdmin(String name, StaffRole role, EnableDisableStatus status, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Staff> result = staffRepository.getStaffForAdmin(name, role == null ? null : role.toString(), status == null ? null : status.ordinal(), pageable);
        int totalPage = result.getTotalPages();
        long totalCustomer = result.getTotalElements();

        List<StaffForAdmin> staffList = result.stream().map(StaffForAdmin::new).collect(Collectors.toList());

        return new StaffListForAdminResponseBody(staffList, totalPage, totalCustomer);
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
        if(staff.get().getRole().equals(StaffRole.STAFF_ORD)) {
            staff.get().getPickupPoint().clear();
        }
        if(staff.get().getRole().equals(StaffRole.STAFF_DLV_1)) {
            staff.get().getDeliverStaffList().forEach(deliverStaff -> deliverStaff.setDeliverManagerStaff(null));
            staff.get().getDeliverStaffList().clear();
        }
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
    public StaffListResponseBody getStaffForDeliverManager(String name, OrderType orderType, LocalDate deliverDate, UUID timeFrameId, UUID orderBatchId, UUID orderGroupId, UUID deliverMangerId) {
        if(orderType == null) {
            orderType = OrderType.SINGLE;
        }

        Optional<Staff> deliverManager = staffRepository.findById(deliverMangerId);
        if(!deliverManager.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_NOT_FOUND.getCode()), AdditionalResponseCode.STAFF_NOT_FOUND.toString());
        }

        Optional<TimeFrame> timeFrame = timeFrameRepository.findById(timeFrameId);
         if(!timeFrame.isPresent()) {
             throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.TIME_FRAME_NOT_FOUND.getCode()), AdditionalResponseCode.TIME_FRAME_NOT_FOUND.toString());
         }

         // check if batch id exist if mode is batch
        Optional<OrderBatch> orderBatch = null;
        if(orderType.ordinal() == OrderType.ORDER_BATCH.ordinal()) {
            if(orderBatchId == null) {
                throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.ORDER_BATCH_NOT_FOUND.getCode()), AdditionalResponseCode.ORDER_BATCH_NOT_FOUND.toString());
            }
            orderBatch = orderBatchRepository.findById(orderBatchId);
            if(!orderBatch.isPresent()){
                throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.ORDER_BATCH_NOT_FOUND.getCode()), AdditionalResponseCode.ORDER_BATCH_NOT_FOUND.toString());
            }
        }

        // check if group id exist if mode is group
        Optional<OrderGroup> orderGroup = null;
        if(orderType.ordinal() == OrderType.ORDER_GROUP.ordinal()) {
            if(orderGroupId == null) {
                throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.ORDER_BATCH_NOT_FOUND.getCode()), AdditionalResponseCode.ORDER_BATCH_NOT_FOUND.toString());
            }
            orderGroup = orderGroupRepositorys.findById(orderGroupId);
            if(!orderGroup.isPresent()){
                throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.ORDER_GROUP_NOT_FOUND.getCode()), AdditionalResponseCode.ORDER_GROUP_NOT_FOUND.toString());
            }
        }

        List<Staff> staffList = staffRepository.getAllStaffForDeliverManager(name, StaffRole.STAFF_DLV_0.toString(), deliverMangerId);
        HashMap<UUID, Staff> staffHashMap = new HashMap();
        for (Staff staff : staffList) {
            // init IsAvailableForDelivering
            staff.setIsAvailableForDelivering(true);
            staffHashMap.put(staff.getId(), staff);
        }

         // check collide with order group (for all mode BATCH, GROUP, SINGLE)
        List<Staff> removeStaffList = staffRepository.getStaffWithDeliverDateAndTimeFrame(staffList.stream().map(staff -> staff.getId()).collect(Collectors.toList()), name, StaffRole.STAFF_DLV_0.toString(), deliverDate, timeFrame.get().getId());
        HashMap<UUID, Staff> removeStaffHashMap = new HashMap<>();
        for (Staff removeStaff : removeStaffList) {
            removeStaffHashMap.put(removeStaff.getId(), removeStaff);
        }

        if(orderType.ordinal() == OrderType.ORDER_GROUP.ordinal()) {
            // check collide with order batch / single order
            List<Staff> removeStaffByDoorToDoorOrderList = staffRepository.getStaffWithDeliverDateAndTimeFrameByDoorToDoorOrder(staffList.stream().map(staff -> staff.getId()).collect(Collectors.toList()), name, StaffRole.STAFF_DLV_0.toString(), deliverDate, timeFrame.get().getId());
            for (Staff removeStaffByDoorToDoorOrder : removeStaffByDoorToDoorOrderList) {
                if(!removeStaffHashMap.containsKey(removeStaffByDoorToDoorOrder.getId())) {
                    removeStaffHashMap.put(removeStaffByDoorToDoorOrder.getId(), removeStaffByDoorToDoorOrder);
                    removeStaffList.add(removeStaffByDoorToDoorOrder);
                }
            }
        }

        for (Staff removeStaff : removeStaffList) {
//            staffList.removeIf(staff -> removeStaff.getId() == staff.getId());
//            staffHashMap.remove(removeStaff.getId());
            staffHashMap.get(removeStaff.getId()).setIsAvailableForDelivering(false);
        }


        // over limit handler for group mode (no need to check with collide batch, single order because it's already been done above)
        if(orderType.ordinal() == OrderType.ORDER_GROUP.ordinal()) {
            List<Staff> staffWithOrderGroup = staffRepository.getStaffWithDeliverDateWithGroupWithDifferentTimeFrame(staffList.stream().filter(staff -> staff.getIsAvailableForDelivering() == true).map(staff -> staff.getId()).collect(Collectors.toList()), deliverDate, timeFrame.get().getId());
            for (Staff staff : staffWithOrderGroup) {
                if(staff.getOrderGroupList() != null &&  staff.getOrderGroupList().size() > 0){
                    // sort time frame ascending
                    staff.getOrderGroupList().sort(Comparator.comparing(b -> b.getTimeFrame().getFromHour()));

                    // init over limit alert list
                    staff.setOverLimitAlertList(new ArrayList<>());

                    // find groups that after and before for target group
                    OrderGroup orderGroupAfterTargetGroup = null;
                    OrderGroup orderGroupBeforeTargetGroup = null;
                    for (int i = 0; i < staff.getOrderGroupList().size() ; i++) {
                        // find batch in staff batch list which is after the target batch
                        if(orderGroup.get().getTimeFrame().getFromHour().isBefore(staff.getOrderGroupList().get(i).getTimeFrame().getFromHour())) {
                            orderGroupAfterTargetGroup = staff.getOrderGroupList().get(i);
                            orderGroupBeforeTargetGroup = i - 1 >= 0 ? staff.getOrderGroupList().get(i-1) :  null;
                            break;
                        }
                    }

                    // if orderGroupAfterTargetGroup is null after loop -> time frame of target group is the highest -> assign last group in staff batch list to orderGroupBeforeTargetGroup
                    if (orderGroupAfterTargetGroup == null) {
                        orderGroupBeforeTargetGroup = staff.getOrderGroupList().get(staff.getOrderGroupList().size()-1);
                    }

                    if(orderGroupAfterTargetGroup != null) {
                        Double distance = Utils.haversineFormulaCalculate(orderGroup.get().getPickupPoint().getLatitude(), orderGroup.get().getPickupPoint().getLongitude()
                                , orderGroupAfterTargetGroup.getPickupPoint().getLatitude(), orderGroupAfterTargetGroup.getPickupPoint().getLongitude());


                        // Calculate duration between toHour of target group and fromHour of orderGroupAfterTargetGroup
                        Duration duration = Duration.between(orderGroup.get().getTimeFrame().getToHour(), orderGroupAfterTargetGroup.getTimeFrame().getFromHour());

                        Double limit =  Precision.round(systemConfigurationService.getConfiguration().getLimitMeterPerMinute() * Math.abs(duration.toMinutes()) * 0.001, 1);

                        // over limit
                        Double difference = Precision.round(distance, 1) - limit;
                        if(difference > 0) {
                            String fromHourOfOrderGroupAfterTargetGroupFormat = orderGroupAfterTargetGroup.getTimeFrame().getFromHour().toString().substring(0, 5);
                            String toHourOfOrderGroupAfterTargetGroupFormat = orderGroupAfterTargetGroup.getTimeFrame().getToHour().toString().substring(0, 5);
                            String alertMessage = "Vướt giới hạn so với khung giờ " + "kế tiếp " + "(" + fromHourOfOrderGroupAfterTargetGroupFormat + "-" + toHourOfOrderGroupAfterTargetGroupFormat + ")";
                            Double limitExceedValue = Precision.round(difference, 1);
                            String limitExceed = Precision.round(difference, 1) + "km";
                            staff.getOverLimitAlertList().add(new OverLimitAlertBody(limitExceedValue, limitExceed, alertMessage));

                        }

                    }

                    if(orderGroupBeforeTargetGroup != null) {
                        Double distance = Utils.haversineFormulaCalculate(orderGroup.get().getPickupPoint().getLatitude(), orderGroup.get().getPickupPoint().getLongitude()
                                , orderGroupBeforeTargetGroup.getPickupPoint().getLatitude(), orderGroupBeforeTargetGroup.getPickupPoint().getLongitude());
                        Duration duration = Duration.between(orderGroupBeforeTargetGroup.getTimeFrame().getToHour(), orderGroup.get().getTimeFrame().getFromHour());

                        Double limit =  Precision.round(systemConfigurationService.getConfiguration().getLimitMeterPerMinute() * Math.abs(duration.toMinutes()) * 0.001, 1);

                        // over limit
                        Double difference = Precision.round(distance, 1) - limit;
                        if(difference > 0) {
                            String fromHourOfOrderGroupBeforeTargetGroupFormat = orderGroupBeforeTargetGroup.getTimeFrame().getFromHour().toString().substring(0, 5);
                            String toHourOfOrderGroupBeforeTargetGroupFormat = orderGroupBeforeTargetGroup.getTimeFrame().getToHour().toString().substring(0, 5);
                            String alertMessage = "Vướt giới hạn so với khung giờ " + "kế trước " + "(" + fromHourOfOrderGroupBeforeTargetGroupFormat + "-" + toHourOfOrderGroupBeforeTargetGroupFormat + ")";
                            Double limitExceedValue = Precision.round(difference, 1);
                            String limitExceed = Precision.round(difference, 1) + "km";
                            staff.getOverLimitAlertList().add(new OverLimitAlertBody(limitExceedValue, limitExceed, alertMessage));

                        }
                    }
                    staff.getOverLimitAlertList().sort((o1, o2) -> o2.getLimitExceedValue().compareTo(o1.getLimitExceedValue()));
                }
            }
            // map calculated alert to real staff list
            for (Staff staff : staffWithOrderGroup) {
                if(staff.getOverLimitAlertList() != null) {
                    staffHashMap.get(staff.getId()).setOverLimitAlertList(staff.getOverLimitAlertList());
                }
            }
        }



        // over limit handler for batch mode
        if(orderType.ordinal() == OrderType.ORDER_BATCH.ordinal()) {
//            List<Object[]> countCollideBatchForStaffList =  staffRepository.countCollideBatchForStaff(staffList.stream().map(staff -> staff.getId()).collect(Collectors.toList()), deliverDate, timeFrame.get().getFromHour(), timeFrame.get().getToHour());
            // remove staff from staff list which have been already assigned batch in the same time frame and date
            List<Staff> removeStaffListForBatch = staffRepository.getStaffWithDeliverDateWithBatchWithSameTimeFrame(staffList.stream().filter(staff -> staff.getIsAvailableForDelivering() == true).map(staff -> staff.getId()).collect(Collectors.toList()), deliverDate, timeFrame.get().getId());
            for (Staff removeStaff : removeStaffListForBatch) {
//                staffList.removeIf(staff -> removeStaff.getId() == staff.getId());
//                staffHashMap.remove(removeStaff.getId());
                staffHashMap.get(removeStaff.getId()).setIsAvailableForDelivering(false);
            }

            List<Staff> staffWithOrderBatch = staffRepository.getStaffWithDeliverDateWithBatchWithDifferentTimeFrame(staffList.stream().filter(staff -> staff.getIsAvailableForDelivering() == true).map(staff -> staff.getId()).collect(Collectors.toList()), deliverDate, timeFrame.get().getId());

            for (Staff staff : staffWithOrderBatch) {
                if(staff.getOrderBatchList() != null &&  staff.getOrderBatchList().size() > 0) {
                    // sort time frame ascending
                    staff.getOrderBatchList().sort(Comparator.comparing(b -> b.getTimeFrame().getFromHour()));

                    // init over limit alert list
                    staff.setOverLimitAlertList(new ArrayList<>());

                    // find batches that after and before for target batch
                    OrderBatch orderBatchAfterTargetBatch = null;
                    OrderBatch orderBatchBeforeTargetBatch = null;
                    for (int i = 0; i < staff.getOrderBatchList().size() ; i++) {
                        // find batch in staff batch list which is after the target batch
                        if(orderBatch.get().getTimeFrame().getFromHour().isBefore(staff.getOrderBatchList().get(i).getTimeFrame().getFromHour())) {
                            orderBatchAfterTargetBatch = staff.getOrderBatchList().get(i);
                            orderBatchBeforeTargetBatch = i - 1 >= 0 ? staff.getOrderBatchList().get(i-1) :  null;
                            break;
                        }
                    }

                    // if orderBatchAfterTargetBatch is null after loop -> time frame of target batch is the highest -> assign last batch in staff batch list to orderBatchBeforeTargetBatch
                    if (orderBatchAfterTargetBatch == null) {
                        orderBatchBeforeTargetBatch = staff.getOrderBatchList().get(staff.getOrderBatchList().size()-1);
                    }

                    if(orderBatchAfterTargetBatch != null) {
                        Double distance = Utils.haversineFormulaCalculate(orderBatch.get().getAverageLatitude(), orderBatch.get().getAverageLongitude()
                                , orderBatchAfterTargetBatch.getAverageLatitude(), orderBatchAfterTargetBatch.getAverageLongitude());


                        // Calculate duration between toHour of target batch and fromHour of orderBatchAfterTargetBatch
                        Duration duration = Duration.between(orderBatch.get().getTimeFrame().getToHour(), orderBatchAfterTargetBatch.getTimeFrame().getFromHour());

                        Double limit =  Precision.round(systemConfigurationService.getConfiguration().getLimitMeterPerMinute() * Math.abs(duration.toMinutes()) * 0.001, 1);

                        // over limit
                        Double difference = Precision.round(distance, 1) - limit;
                        if(difference > 0) {
                            String fromHourOfOrderBatchAfterTargetBatchFormat = orderBatchAfterTargetBatch.getTimeFrame().getFromHour().toString().substring(0, 5);
                            String toHourOfOrderBatchAfterTargetBatchFormat = orderBatchAfterTargetBatch.getTimeFrame().getToHour().toString().substring(0, 5);
                            String alertMessage = "Vướt giới hạn so với khung giờ " + "kế tiếp " + "(" + fromHourOfOrderBatchAfterTargetBatchFormat + "-" + toHourOfOrderBatchAfterTargetBatchFormat + ")";
                            Double limitExceedValue = Precision.round(difference, 1);
                            String limitExceed = Precision.round(difference, 1) + "km";
                            staff.getOverLimitAlertList().add(new OverLimitAlertBody(limitExceedValue, limitExceed, alertMessage));

                        }
                    }

                    if(orderBatchBeforeTargetBatch != null) {
                        Double distance = Utils.haversineFormulaCalculate(orderBatch.get().getAverageLatitude(), orderBatch.get().getAverageLongitude()
                                , orderBatchBeforeTargetBatch.getAverageLatitude(), orderBatchBeforeTargetBatch.getAverageLongitude());

                        // Calculate duration between toHour of orderBatchBeforeTargetBatch and toHour of target batch
                        Duration duration = Duration.between(orderBatchBeforeTargetBatch.getTimeFrame().getToHour(), orderBatch.get().getTimeFrame().getFromHour());

                        Double limit =  Precision.round(systemConfigurationService.getConfiguration().getLimitMeterPerMinute() * Math.abs(duration.toMinutes()) * 0.001, 1);

                        // over limit
                        Double difference = Precision.round(distance, 1) - limit;
                        if(difference > 0) {
                            String fromHourOfOrderBatchBeforeTargetBatchFormat = orderBatchBeforeTargetBatch.getTimeFrame().getFromHour().toString().substring(0, 5);
                            String toHourOfOrderBatchBeforeTargetBatchFormat = orderBatchBeforeTargetBatch.getTimeFrame().getToHour().toString().substring(0, 5);
                            String alertMessage = "Vướt giới hạn so với khung giờ " + "kế trước " + "(" + fromHourOfOrderBatchBeforeTargetBatchFormat + "-" + toHourOfOrderBatchBeforeTargetBatchFormat + ")";
                            Double limitExceedValue = Precision.round(difference, 1);
                            String limitExceed = Precision.round(difference, 1) + "km";
                            staff.getOverLimitAlertList().add(new OverLimitAlertBody(limitExceedValue, limitExceed, alertMessage));
                        }
                    }

                    staff.getOverLimitAlertList().sort((o1, o2) -> o2.getLimitExceedValue().compareTo(o1.getLimitExceedValue()));
                }
            }
            // map calculated alert to real staff list
            for (Staff staff : staffWithOrderBatch) {
                if(staff.getOverLimitAlertList() != null) {
                    staffHashMap.get(staff.getId()).setOverLimitAlertList(staff.getOverLimitAlertList());
                }
            }
//            for(Object[] countCollideBatchForStaff : countCollideBatchForStaffList) {
//                UUID staffIdResult = (UUID) countCollideBatchForStaff[0];
//                Long collideBatchCountResult = (Long) countCollideBatchForStaff[1];
//                staffHashMap.get(staffIdResult).setCollideOrderBatchQuantity(collideBatchCountResult);
//            }
//            for (Staff staff : staffList) {
//                if(staff.getCollideOrderBatchQuantity() == null) {
//                    staff.setCollideOrderBatchQuantity(Long.parseLong("0"));
//                }
//            }
        }

        // init field for staff which have null overLimitAlertMap
        for (Staff staff : staffList) {
            if(staff.getOverLimitAlertList() == null) {
                staff.setOverLimitAlertList(new ArrayList<>());
            }
        }

        // sort staff base on disable/enable first ->  the highest limit exceed of each staff
        staffList.sort((s1, s2) -> {
            if(s1.getIsAvailableForDelivering() == false) {
                return 1 ;
            }
            if(s2.getIsAvailableForDelivering() == false) {
                return -1 ;
            }

            Double highestLimitExceedS1 = s1.getOverLimitAlertList().size() > 0 ? s1.getOverLimitAlertList().get(0).getLimitExceedValue() : 0;
            Double highestLimitExceedS2 = s2.getOverLimitAlertList().size() > 0 ? s2.getOverLimitAlertList().get(0).getLimitExceedValue() : 0;
            if(highestLimitExceedS1 - highestLimitExceedS2 > 0) return 1;
            if(highestLimitExceedS1 - highestLimitExceedS2 < 0) return -1;
            return 0;
        });


//        Pageable pageable = PageRequest.of(page, limit);

//        if(orderType.ordinal() == OrderType.ORDER_GROUP.ordinal()){
        // find deliver that have group which collide with current

//        }
//        List<Staff> result = staffRepository.getStaffForDeliverManager(name, StaffRole.STAFF_DLV_0.toString(), orderType.ordinal(), deliverDate, timeFrameId);
//        int totalPage = result.getTotalPages();
//        long totalCustomer = result.getTotalElements();

        return new StaffListResponseBody(staffList, null, null);
    }

    @Override
    @Transactional
    public Staff updateDeliversForDeliverManager(DeliversAssignmentToManager deliversAssignmentToManager) {
        HashMap errorFields = new HashMap<>();

        Optional<Staff> deliverManager = staffRepository.findByIdByDeliverManagerRole(deliversAssignmentToManager.getDeliverManagerId(), StaffRole.STAFF_DLV_1.toString());
        if(!deliverManager.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_NOT_FOUND.getCode()), AdditionalResponseCode.STAFF_NOT_FOUND.toString());
        }

        List<Staff> deliverStaffList = staffRepository.findAllByIdByDeliverRole(deliversAssignmentToManager.getDeliverIdList(), StaffRole.STAFF_DLV_0.toString());
        HashMap<UUID, Staff> deliverStaffHashMap = new HashMap();
        deliverStaffList.forEach(staff -> deliverStaffHashMap.put(staff.getId(), staff));

        HashSet<UUID> deliverStaffNotFoundIdList = new HashSet<>();
        for (UUID deliverStaffId : deliversAssignmentToManager.getDeliverIdList()) {
            if(!deliverStaffHashMap.containsKey(deliverStaffId)) {
                deliverStaffNotFoundIdList.add(deliverStaffId);
            }
        }

        if(deliverStaffNotFoundIdList.size() > 0) {
            errorFields.put("deliverIdList", "Deliver staff id " + deliverStaffNotFoundIdList.stream().map(UUID::toString).collect(Collectors.joining(",")) + " not found");
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

//       clear deliverStaffList
        deliverManager.get().getDeliverStaffList().forEach(deliver -> deliver.setDeliverManagerStaff(null));
        deliverManager.get().getDeliverStaffList().clear();

//       add new deliverStaffList
        deliverManager.get().setDeliverStaffList(deliverStaffList);
        deliverStaffList.forEach(deliver -> deliver.setDeliverManagerStaff(deliverManager.get()));

        return deliverManager.get();
    }

    @Override
    @Transactional
    public Staff updateDeliverManagerForDeliver(UUID deliverId, UUID deliverManagerId) {
        Optional<Staff> deliverManager = staffRepository.findByIdByDeliverManagerRole(deliverManagerId, StaffRole.STAFF_DLV_1.toString());
        Optional<Staff> deliver = staffRepository.findByIdByDeliverRole(deliverId, StaffRole.STAFF_DLV_0.toString());
        if(!deliverManager.isPresent() || !deliver.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.STAFF_NOT_FOUND.getCode()), AdditionalResponseCode.STAFF_NOT_FOUND.toString());
        }

        // remove old manager
        if(deliver.get().getDeliverManagerStaff() != null){
            deliver.get().getDeliverManagerStaff().getDeliverStaffList().removeIf(d -> d.getId() == deliverId);
            deliver.get().setDeliverManagerStaff(null);
        }

        // assign new manager
        deliver.get().setDeliverManagerStaff(deliverManager.get());
        deliver.get().getDeliverManagerStaff().getDeliverStaffList().add(deliver.get());

        return deliver.get();
    }

    @Override
    public List<Staff> getAllDeliverForAdmin() {
        List<Staff> deliverList = staffRepository.findAllByDeliverRole(StaffRole.STAFF_DLV_0.toString());
        deliverList.sort((d1, d2) -> {
            if(d1.getDeliverManagerStaff() != null && d2.getDeliverManagerStaff() == null) return 1;
            if(d1.getDeliverManagerStaff() == null && d2.getDeliverManagerStaff() != null) return -1;
            return 0;
        });
        return deliverList;
    }

    @Override
    public List<Staff> getAllDeliverManagerForAdmin() {
        List<Staff> deliverManagerList = staffRepository.findAllByDeliverManagerRole(StaffRole.STAFF_DLV_1.toString());
        return deliverManagerList;
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
