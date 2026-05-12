package com.airway.tickets_management_system.controllers;

public class FlightRequest {
    private String flightNumber;
    private String origin;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private Integer totalSeats;
    private Integer availableSeats;
    private Double price;
    private String status;

    public FlightRequest() {}

    public String getFlightNumber()              { return flightNumber; }
    public void setFlightNumber(String v)        { this.flightNumber = v; }

    public String getOrigin()                    { return origin; }
    public void setOrigin(String v)              { this.origin = v; }

    public String getDestination()               { return destination; }
    public void setDestination(String v)         { this.destination = v; }

    public String getDepartureTime()             { return departureTime; }
    public void setDepartureTime(String v)       { this.departureTime = v; }

    public String getArrivalTime()               { return arrivalTime; }
    public void setArrivalTime(String v)         { this.arrivalTime = v; }

    public Integer getTotalSeats()               { return totalSeats; }
    public void setTotalSeats(Integer v)         { this.totalSeats = v; }

    public Integer getAvailableSeats()           { return availableSeats; }
    public void setAvailableSeats(Integer v)     { this.availableSeats = v; }

    public Double getPrice()                     { return price; }
    public void setPrice(Double v)               { this.price = v; }

    public String getStatus()                    { return status; }
    public void setStatus(String v)              { this.status = v; }
}
