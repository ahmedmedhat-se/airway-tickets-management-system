package com.airway.tickets_management_system.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
public class Flight {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String flightNumber;
    
    @Column(nullable = false)
    private String origin;
    
    @Column(nullable = false)
    private String destination;
    
    @Column(nullable = false)
    private LocalDateTime departureTime;
    
    @Column(nullable = false)
    private LocalDateTime arrivalTime;
    
    @Column(nullable = false)
    private Integer totalSeats;
    
    @Column(nullable = false)
    private Integer availableSeats;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(nullable = false)
    private String status;
    
    public Flight() {
    }

    public Flight(String flightNumber, String origin, String destination, LocalDateTime departureTime, LocalDateTime arrivalTime, Integer totalSeats, Double price) {
    }

    public long getId() {
        
    }

    public void setId(Long id) {
    }

    public String getFlightNumber() {
    }
    
    public void setFlightNumber(String flightNumber) {
    }

    public String getOrigin() {
    }

    public void setOrigin(String origin) {
    }

    public String getDestination() {
    }

    public void setDestination(String destination) {
    }

    public LocalDateTime getDepartureTime() {
    }

    public void setDepartureTime(LocalDateTime departureTime) {
    }

    public LocalDateTime getArrivalTime() {
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
    }

    public Integer getTotalSeats() {
    }

    public void setTotalSeats(Integer totalSeats) {
    }

    public Integer getAvailableSeats() {
    }

    public void setAvailableSeats(Integer availableSeats) {
    }

    public Double getPrice() {
    }
    public void setPrice(Double price) {
    }

    public String getStatus() {
    }

    public void setStatus(String status) {
    }
}