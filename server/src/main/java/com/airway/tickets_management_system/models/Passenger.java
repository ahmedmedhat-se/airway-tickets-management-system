package com.airway.tickets_management_system.models;

import jakarta.persistence.*;

@Entity
@Table(name = "passengers")
public class Passenger {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String passportNumber;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String phone;
    
    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;
    
    @Column(nullable = false)
    private String seatNumber;
    
    @Column(nullable = false)
    private String bookingStatus;
    
    @ManyToOne
    @JoinColumn(name = "booked_by", nullable = false)
    private User bookedBy;
    
    public Passenger() {
    }
    public Passenger(String fullName, String passportNumber, String email, String phone, Flight flight, String seatNumber, User bookedBy) {
    }
    public Long getId() {
    }
    public void setId(Long id) {
    }
    public String getFullName() {
    }
    public void setFullName(String fullName) {
    }
    public String getPassportNumber() {
    }
    public void setPassportNumber(String passportNumber) {
    }
    public String getEmail() {
    }
    public void setEmail(String email) {
    }
    public String getPhone() {
    }
    public void setPhone(String phone) {
    }
    public Flight getFlight() {
    }
    public void setFlight(Flight flight) {
    }
    public String getSeatNumber() {
    }
    public void setSeatNumber(String seatNumber) {
    }
    public String getBookingStatus() {
    }
    public void setBookingStatus(String bookingStatus) {
    }
    public User getBookedBy() {
    }
    public void setBookedBy(User bookedBy) {
    }
}