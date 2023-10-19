package com.fpt.capstone.savinghourmarket.common;

public enum Month {
    JAN(1),
    FEB(2),
    MAR(3),
    APR(4),
    MAY(5),
    JUNE(6),
    JULY(7),
    AUG(8),
    SEPT(9),
    OCT(10),
    NOV(11),
    DEC(12);

    private int monthInNumber;

    Month(int monthInNumber) {
        this.monthInNumber = monthInNumber;
    }

    public int getMonthInNumber() {
        return this.monthInNumber;
    }

    public static String getMonthNameFromNumber(Integer number) {
        for(Month month : values()) {
            if(month.getMonthInNumber() == number) return month.toString();
        }
        return null;
    }
}
