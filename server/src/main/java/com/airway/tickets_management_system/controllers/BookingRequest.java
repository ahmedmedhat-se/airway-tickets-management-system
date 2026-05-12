package com.airway.tickets_management_system.controllers;

public class BookingRequest {
    private String fullName;
    private String passportNumber;
    private String email;
    private String phone;
    private String seatNumber;

    public BookingRequest() {}

    public String getFullName()        { return fullName; }
    public void setFullName(String v)  { this.fullName = v; }

    public String getPassportNumber()        { return passportNumber; }
    public void setPassportNumber(String v)  { this.passportNumber = v; }

    public String getEmail()        { return email; }
    public void setEmail(String v)  { this.email = v; }

    public String getPhone()        { return phone; }
    public void setPhone(String v)  { this.phone = v; }

    public String getSeatNumber()        { return seatNumber; }
    public void setSeatNumber(String v)  { this.seatNumber = v; }
}
