package com.fpt.capstone.savinghourmarket.common;

public enum Quarter {
    Q1(1),
    Q2(2),
    Q3(3),
    Q4(4);

    private int quarterInNumber;

    Quarter(int quarterInNumber) {
        this.quarterInNumber = quarterInNumber;
    }

    public int getQuarterInNumber() {
        return this.quarterInNumber;
    }
}
