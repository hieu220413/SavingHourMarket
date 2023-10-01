package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.entity.Staff;
import com.fpt.capstone.savinghourmarket.exception.InvalidUserInputException;
import com.fpt.capstone.savinghourmarket.model.PasswordRequestBody;
import com.fpt.capstone.savinghourmarket.model.StaffUpdateRequestBody;
import com.fpt.capstone.savinghourmarket.repository.StaffRepository;
import com.fpt.capstone.savinghourmarket.service.StaffService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;

    private final FirebaseAuth firebaseAuth;

    @Override
    public Staff getInfoGoogleLogged(String email) throws FirebaseAuthException {
        Optional<Staff> staff = staffRepository.findByEmail(email);
        if(!staff.isPresent()){
            UserInfo userInfo = firebaseAuth.getUserByEmail(email);
            Staff newStaff = new Staff();
            newStaff.setEmail(userInfo.getEmail());
            newStaff.setAvatarUrl(userInfo.getPhotoUrl());
            newStaff.setFullName(userInfo.getDisplayName());
            newStaff.setStatus(EnableDisableStatus.ENABLE.ordinal());
            return staffRepository.save(newStaff);
        }
        return staff.get();
    }

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
            throw new InvalidUserInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        if(imageFile != null && !imageFile.isEmpty()){
            String imageUrl = Utils.uploadPublicFileToFirebaseStorage(imageFile);
            targetedStaff.get().setAvatarUrl(imageUrl);
        }

        return targetedStaff.get();
    }

}
