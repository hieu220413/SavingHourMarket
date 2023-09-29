package com.fpt.capstone.savinghourmarket.common;

public enum District {
    DISTRICT_1("District 1"),
    DISTRICT_2("District 2"),
    DISTRICT_3("District 3"),
    DISTRICT_4("District 4"),
    DISTRICT_5("District 5"),
    DISTRICT_6("District 6"),
    DISTRICT_7("District 7"),
    DISTRICT_8("District 8"),
    DISTRICT_9("District 9"),
    DISTRICT_10("District 10"),
    DISTRICT_11("District 11"),
    DISTRICT_12("District 12"),
    BINH_TAN("Bình Tân"),
    BINH_THANH("Bình Thạnh"),
    GO_VAP("Gò Vấp"),
    PHU_NHUAN("Phú Nhuận"),
    TAN_BINH("Tân Bình"),
    TAN_PHU("Tân Phú"),
    THU_DUC("Thủ Đức"),
    BINH_CHANH("Bình Chánh"),
    CAN_GIO("Cần Giờ"),
    CU_CHI("Củ Chi"),
    HOC_MON("Hóc Môn"),
    NHA_BE("Nhà Bè");

    private final String districtName;

    District(String districtName) {
        this.districtName = districtName;
    }

    public String getDistrictName() {
        return districtName;
    }
}
