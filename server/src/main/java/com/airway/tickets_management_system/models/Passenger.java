package com.airway.tickets_management_system.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    /**
     * Serialize only the flight's scalar fields — avoids infinite recursion
     * if Flight ever gains a back-reference to passengers, and keeps the
     * response payload lean.
     */
    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Flight flight;

    @Column(nullable = false)
    private String seatNumber;

    @Column(nullable = false)
    private String bookingStatus;

    /**
     * Serialize only safe user fields — never expose the password.
     */
    @ManyToOne
    @JoinColumn(name = "booked_by", nullable = false)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User bookedBy;

    // ── Constructors ──────────────────────────────────────────────────────────

    public Passenger() {}

    public Passenger(String fullName, String passportNumber, String email,
                     String phone, Flight flight, String seatNumber, User bookedBy) {
        this.fullName = fullName;
        this.passportNumber = passportNumber;
        this.email = email;
        this.phone = phone;
        this.flight = flight;
        this.seatNumber = seatNumber;
        this.bookedBy = bookedBy;
        this.bookingStatus = "CONFIRMED";
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getId()              { return id; }
    public void setId(Long id)       { this.id = id; }

    public String getFullName()              { return fullName; }
    public void setFullName(String v)        { this.fullName = v; }

    public String getPassportNumber()        { return passportNumber; }
    public void setPassportNumber(String v)  { this.passportNumber = v; }

    public String getEmail()         { return email; }
    public void setEmail(String v)   { this.email = v; }

    public String getPhone()         { return phone; }
    public void setPhone(String v)   { this.phone = v; }

    public Flight getFlight()            { return flight; }
    public void setFlight(Flight v)      { this.flight = v; }

    public String getSeatNumber()        { return seatNumber; }
    public void setSeatNumber(String v)  { this.seatNumber = v; }

    public String getBookingStatus()         { return bookingStatus; }
    public void setBookingStatus(String v)   { this.bookingStatus = v; }

    public User getBookedBy()            { return bookedBy; }
    public void setBookedBy(User v)      { this.bookedBy = v; }
}
