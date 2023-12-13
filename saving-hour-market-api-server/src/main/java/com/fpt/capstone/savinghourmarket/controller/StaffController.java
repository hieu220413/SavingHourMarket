package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.*;
import com.fpt.capstone.savinghourmarket.entity.Configuration;
import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.entity.Staff;
import com.fpt.capstone.savinghourmarket.exception.SystemNotInMaintainStateException;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.service.StaffService;
import com.fpt.capstone.savinghourmarket.service.SystemConfigurationService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;
    private final FirebaseAuth firebaseAuth;
    private final SystemConfigurationService systemConfigurationService;

//    @RequestMapping(value = "/getInfoAfterGoogleLogged", method = RequestMethod.GET)
//    public ResponseEntity<Staff> getInfoGoogleLogged(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
//        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
//        String email = Utils.validateIdToken(idToken, firebaseAuth);
//        Staff staff = staffService.getInfoGoogleLogged(email);
//        return ResponseEntity.status(HttpStatus.OK).body(staff);
//    }

    @RequestMapping(value = "assignPickupPointForCreateAccount", method = RequestMethod.PUT)
    public ResponseEntity<Staff> assignPickupPointForCreateAccount(@Parameter(hidden = true)  @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @Valid @RequestBody StaffPickupPointAssignmentForCreateAccountBody staffPickupPointAssignmentForCreateAccountBody) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Staff staff = staffService.assignPickupPointForCreateAccount(staffPickupPointAssignmentForCreateAccountBody);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "assignPickupPoint", method = RequestMethod.PUT)
    public ResponseEntity<Staff> assignPickupPoint(@Parameter(hidden = true)  @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @Valid @RequestBody StaffPickupPointAssignmentBody staffPickupPointAssignmentBody) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Configuration configuration = systemConfigurationService.getConfiguration();
        if(configuration.getSystemStatus() != SystemStatus.MAINTAINING.ordinal()){
            throw new SystemNotInMaintainStateException(HttpStatus.valueOf(AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.getCode()), AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.toString());
        }
        Staff staff = staffService.assignPickupPoint(staffPickupPointAssignmentBody);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "unAssignPickupPoint", method = RequestMethod.PUT)
    public ResponseEntity<Staff> unAssignPickupPoint(@Parameter(hidden = true)  @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @Valid @RequestBody StaffPickupPointAssignmentBody staffPickupPointAssignmentBody) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Configuration configuration = systemConfigurationService.getConfiguration();
        if(configuration.getSystemStatus() != SystemStatus.MAINTAINING.ordinal()){
            throw new SystemNotInMaintainStateException(HttpStatus.valueOf(AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.getCode()), AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.toString());
        }
        Staff staff = staffService.unAssignPickupPoint(staffPickupPointAssignmentBody);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "getInfo", method = RequestMethod.GET)
    public ResponseEntity<Staff> getInfo(@Parameter(hidden = true)  @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String email = Utils.validateIdToken(idToken, firebaseAuth);
        Staff staff = staffService.getInfo(email);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "getCustomerDetailByEmail", method = RequestMethod.GET)
    public ResponseEntity<Customer> getCustomerDetailByEmail(@Parameter(hidden = true)  @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestParam String email) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Customer customer = staffService.getCustomerDetailByEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(customer);
    }

    @RequestMapping(value = "/updateInfo", method = RequestMethod.PUT , consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Staff> updateInfo(@RequestPart StaffUpdateRequestBody staffUpdateRequestBody, @RequestPart(required = false) MultipartFile imageFile, @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException, IOException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String email = Utils.validateIdToken(idToken, firebaseAuth);
        Staff staff = staffService.updateInfo(staffUpdateRequestBody, email, imageFile);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "/createStaffAccount", method = RequestMethod.POST)
    public ResponseEntity<Staff> createStaffAccount(@RequestBody StaffCreateRequestBody staffCreateRequestBody, @RequestParam StaffRole role, @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException, UnsupportedEncodingException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
//        Configuration configuration = systemConfigurationService.getConfiguration();
//        if(configuration.getSystemStatus() != SystemStatus.MAINTAINING.ordinal()){
//            throw new SystemNotInMaintainStateException(HttpStatus.valueOf(AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.getCode()), AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.toString());
//        }
        Staff staff = staffService.createStaffAccount(staffCreateRequestBody, role);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "/getStaffByEmail", method = RequestMethod.GET)
    public ResponseEntity<Staff> getStaffByEmail(@RequestParam String email, @Parameter(hidden = true)  @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Staff staff = staffService.getStaffByEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "/getStaffForAdmin", method = RequestMethod.GET)
    public ResponseEntity<StaffListForAdminResponseBody> getStaffForAdmin(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(required = false) EnableDisableStatus status
            , @RequestParam(required = false) StaffRole role
            , @RequestParam(defaultValue = "") String name
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        StaffListForAdminResponseBody staffListResponseBody = staffService.getStaffForAdmin(name, role, status, page, limit);
        return ResponseEntity.status(HttpStatus.OK).body(staffListResponseBody);
    }


    @RequestMapping(value = "/getStaffForDeliverManager", method = RequestMethod.GET)
    public ResponseEntity<StaffListResponseBody> getStaffForDeliverManager(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
//            , @RequestParam(required = false) EnableDisableStatus status
//            , @RequestParam(required = false) StaffRole role
            , @RequestParam OrderType orderType
            , @RequestParam(required = false) UUID orderBatchId
            , @RequestParam(required = false) UUID orderGroupId
            , @RequestParam LocalDate deliverDate
            , @RequestParam UUID timeFrameId
            , @RequestParam UUID deliverMangerId
            , @RequestParam(defaultValue = "") String name) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        StaffListResponseBody staffListResponseBody = staffService.getStaffForDeliverManager(name, orderType, deliverDate, timeFrameId, orderBatchId, orderGroupId, deliverMangerId);
        return ResponseEntity.status(HttpStatus.OK).body(staffListResponseBody);
    }


    @RequestMapping(value = "/updateStaffAccountStatus", method = RequestMethod.PUT)
    public ResponseEntity<Staff> updateStaffAccountStatus(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            ,@RequestBody @Valid AccountStatusChangeBody accountStatusChangeBody) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String email = Utils.validateIdToken(idToken, firebaseAuth);
//        Configuration configuration = systemConfigurationService.getConfiguration();
//        if(configuration.getSystemStatus() != SystemStatus.MAINTAINING.ordinal()){
//            throw new SystemNotInMaintainStateException(HttpStatus.valueOf(AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.getCode()), AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.toString());
//        }
        Staff staff = staffService.updateStaffAccountStatus(accountStatusChangeBody, email);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "/updateStaffRole", method = RequestMethod.PUT)
    public ResponseEntity<Staff> updateStaffRole(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestBody @Valid StaffRoleUpdateRequestBody staffRoleUpdateRequestBody) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String email = Utils.validateIdToken(idToken, firebaseAuth);
        Configuration configuration = systemConfigurationService.getConfiguration();
        if(configuration.getSystemStatus() != SystemStatus.MAINTAINING.ordinal()){
            throw new SystemNotInMaintainStateException(HttpStatus.valueOf(AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.getCode()), AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.toString());
        }
        Staff staff = staffService.updateStaffRole(staffRoleUpdateRequestBody, email);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "/updateDeliversForDeliverManager", method = RequestMethod.PUT)
    public ResponseEntity<Staff> updateDeliversForDeliverManager(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestBody @Valid DeliversAssignmentToManager deliversAssignmentToManager) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
//        Configuration configuration = systemConfigurationService.getConfiguration();
//        if(configuration.getSystemStatus() != SystemStatus.MAINTAINING.ordinal()){
//            throw new SystemNotInMaintainStateException(HttpStatus.valueOf(AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.getCode()), AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.toString());
//        }
        Staff staff = staffService.updateDeliversForDeliverManager(deliversAssignmentToManager);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "/updateDeliverManagerForDeliver", method = RequestMethod.PUT)
    public ResponseEntity<Staff> updateDeliverManagerForDeliver(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam UUID deliverId, @RequestParam UUID deliverManagerId) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
//        Configuration configuration = systemConfigurationService.getConfiguration();
//        if(configuration.getSystemStatus() != SystemStatus.MAINTAINING.ordinal()){
//            throw new SystemNotInMaintainStateException(HttpStatus.valueOf(AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.getCode()), AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.toString());
//        }
        Staff staff = staffService.updateDeliverManagerForDeliver(deliverId, deliverManagerId);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "/getAllDeliverForAdmin", method = RequestMethod.GET)
    public ResponseEntity<List<Staff>> getAllDeliverForAdmin(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<Staff> staffList = staffService.getAllDeliverForAdmin();
        return ResponseEntity.status(HttpStatus.OK).body(staffList);
    }

    @RequestMapping(value = "/getAllDeliverManagerForAdmin", method = RequestMethod.GET)
    public ResponseEntity<List<Staff>> getAllDeliverManagerForAdmin(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<Staff> staffList = staffService.getAllDeliverManagerForAdmin();
        return ResponseEntity.status(HttpStatus.OK).body(staffList);
    }

//    @RequestMapping(value = "/getAllDeliverForDeliverManager", method = RequestMethod.GET)
//    public ResponseEntity<List<Staff>> getAllDeliverForDeliverManager(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
//            , @RequestParam UUID deliverManagerId) throws FirebaseAuthException {
//        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
//        Utils.validateIdToken(idToken, firebaseAuth);
//        List<Staff> staff = staffService.updateDeliversForDeliverManager(deliversAssignmentToManager);
//        return ResponseEntity.status(HttpStatus.OK).body(staff);
//    }

}
