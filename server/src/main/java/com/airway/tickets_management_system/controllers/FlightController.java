package com.airway.tickets_management_system.controllers;

import com.airway.tickets_management_system.models.Flight;
import com.airway.tickets_management_system.models.Passenger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.List;

@Controller
@RequestMapping("/api/flights")
public class FlightController {
    
    @GetMapping
    @ResponseBody
    public List<Flight> getAllFlights() {
    }
    
    @GetMapping("/search")
    @ResponseBody
    public List<Flight> searchFlights(@RequestParam String origin, @RequestParam String destination, @RequestParam String date) {
    }
    
    @GetMapping("/{id}")
    @ResponseBody
    public Flight getFlightById(@PathVariable Long id) {
    }
    
    @PostMapping
    @ResponseBody
    public Flight addFlight(@RequestBody Flight flight, HttpSession session) {
    }
    
    @PutMapping("/{id}")
    @ResponseBody
    public Flight updateFlight(@PathVariable Long id, @RequestBody Flight flight, HttpSession session) {
    }
    
    @DeleteMapping("/{id}")
    @ResponseBody
    public String deleteFlight(@PathVariable Long id, HttpSession session) {
    }
    
    @PostMapping("/{flightId}/book")
    @ResponseBody
    public Passenger bookTicket(@PathVariable Long flightId, @RequestBody Passenger passenger, HttpSession session) {
    }
    
    @GetMapping("/bookings")
    @ResponseBody
    public List<Passenger> getMyBookings(HttpSession session) {
    }
    
    @DeleteMapping("/bookings/{bookingId}")
    @ResponseBody
    public String cancelBooking(@PathVariable Long bookingId, HttpSession session) {
    }
}