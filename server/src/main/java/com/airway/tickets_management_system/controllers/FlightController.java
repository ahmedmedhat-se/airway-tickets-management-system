package com.airway.tickets_management_system.controllers;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.airway.tickets_management_system.models.Flight;
import com.airway.tickets_management_system.models.Passenger;
import com.airway.tickets_management_system.models.User;
import com.airway.tickets_management_system.repositories.FlightRepository;
import com.airway.tickets_management_system.repositories.PassengerRepository;
import com.airway.tickets_management_system.repositories.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    /** Accepts "yyyy-MM-ddTHH:mm" and "yyyy-MM-ddTHH:mm:ss" */
    private static final DateTimeFormatter DT_FORMATTER = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd'T'HH:mm")
            .optionalStart().appendPattern(":ss").optionalEnd()
            .optionalStart().appendFraction(ChronoField.NANO_OF_SECOND, 0, 9, true).optionalEnd()
            .toFormatter();

    private LocalDateTime parseDateTime(String value) {
        if (value == null || value.isBlank()) return null;
        return LocalDateTime.parse(value.trim(), DT_FORMATTER);
    }

    @Autowired private FlightRepository flightRepository;
    @Autowired private PassengerRepository passengerRepository;
    @Autowired private UserRepository userRepository;

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Reads userId from the existing session without creating a new one. */
    private Long getSessionUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        return (Long) session.getAttribute("userId");
    }

    // ── Flights: public read ──────────────────────────────────────────────────

    @GetMapping
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    @GetMapping("/{id}")
    public Flight getFlightById(@PathVariable Long id) {
        return flightRepository.findById(id).orElse(null);
    }

    @GetMapping("/search")
    public List<Flight> searchFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam String date) {
        return flightRepository.findAll();
    }

    // ── Flights: admin CRUD ───────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> addFlight(
            @RequestBody FlightRequest req,
            HttpServletRequest request) {
        try {
            LocalDateTime departure = parseDateTime(req.getDepartureTime());
            LocalDateTime arrival   = parseDateTime(req.getArrivalTime());

            if (departure == null) return ResponseEntity.badRequest()
                    .body(Map.of("message", "departureTime is required"));
            if (arrival == null) return ResponseEntity.badRequest()
                    .body(Map.of("message", "arrivalTime is required"));

            Flight flight = new Flight();
            flight.setFlightNumber(req.getFlightNumber());
            flight.setOrigin(req.getOrigin());
            flight.setDestination(req.getDestination());
            flight.setDepartureTime(departure);
            flight.setArrivalTime(arrival);
            flight.setTotalSeats(req.getTotalSeats());
            flight.setAvailableSeats(req.getTotalSeats());   // always sync on create
            flight.setPrice(req.getPrice());
            flight.setStatus(req.getStatus() != null && !req.getStatus().isBlank()
                    ? req.getStatus() : "SCHEDULED");

            return ResponseEntity.status(HttpStatus.CREATED).body(flightRepository.save(flight));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid flight data: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFlight(
            @PathVariable Long id,
            @RequestBody FlightRequest req,
            HttpServletRequest request) {

        Flight f = flightRepository.findById(id).orElse(null);
        if (f == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Flight " + id + " not found"));

        try {
            LocalDateTime departure = parseDateTime(req.getDepartureTime());
            LocalDateTime arrival   = parseDateTime(req.getArrivalTime());

            if (departure == null) return ResponseEntity.badRequest()
                    .body(Map.of("message", "departureTime is required"));
            if (arrival == null) return ResponseEntity.badRequest()
                    .body(Map.of("message", "arrivalTime is required"));

            f.setFlightNumber(req.getFlightNumber());
            f.setOrigin(req.getOrigin());
            f.setDestination(req.getDestination());
            f.setDepartureTime(departure);
            f.setArrivalTime(arrival);
            f.setTotalSeats(req.getTotalSeats());
            if (req.getAvailableSeats() != null) f.setAvailableSeats(req.getAvailableSeats());
            f.setPrice(req.getPrice());
            if (req.getStatus() != null && !req.getStatus().isBlank()) f.setStatus(req.getStatus());

            return ResponseEntity.ok(flightRepository.save(f));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid flight data: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFlight(
            @PathVariable Long id,
            HttpServletRequest request) {

        flightRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Flight " + id + " deleted successfully"));
    }

    // ── Booking ───────────────────────────────────────────────────────────────

    /**
     * POST /api/flights/{flightId}/book
     *
     * Session is read with getSession(false) — identical to what AuthInterceptor
     * does — so we always get the same session object that was validated upstream.
     * Returns a flat Map DTO to avoid LazyInitializationException and
     * LocalDateTime serialization issues.
     */
    @PostMapping("/{flightId}/book")
    @Transactional
    public ResponseEntity<Map<String, Object>> bookTicket(
            @PathVariable Long flightId,
            @RequestBody BookingRequest req,
            HttpServletRequest request) {

        // 1. Resolve logged-in user — getSession(false) never creates a new session
        Long userId = getSessionUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized — please log in first"));
        }

        User bookedBy = userRepository.findById(userId).orElse(null);
        if (bookedBy == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Authenticated user not found in database"));
        }

        // 2. Find the flight
        Flight flight = flightRepository.findById(flightId).orElse(null);
        if (flight == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Flight " + flightId + " not found"));
        }

        // 3. Seat availability
        if (flight.getAvailableSeats() == null || flight.getAvailableSeats() <= 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "No seats available on this flight"));
        }

        // 4. Field validation
        if (req.getFullName()       == null || req.getFullName().isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Full name is required"));
        if (req.getPassportNumber() == null || req.getPassportNumber().isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Passport number is required"));
        if (req.getEmail()          == null || req.getEmail().isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        if (req.getPhone()          == null || req.getPhone().isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Phone number is required"));
        if (req.getSeatNumber()     == null || req.getSeatNumber().isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Seat number is required"));

        // 5. Persist passenger
        Passenger passenger = new Passenger();
        passenger.setFullName(req.getFullName());
        passenger.setPassportNumber(req.getPassportNumber());
        passenger.setEmail(req.getEmail());
        passenger.setPhone(req.getPhone());
        passenger.setSeatNumber(req.getSeatNumber());
        passenger.setFlight(flight);
        passenger.setBookedBy(bookedBy);
        passenger.setBookingStatus("CONFIRMED");

        flight.setAvailableSeats(flight.getAvailableSeats() - 1);
        flightRepository.save(flight);
        Passenger saved = passengerRepository.save(passenger);

        // 6. Flat response DTO — no entity references, no Hibernate proxies
        Map<String, Object> resp = new HashMap<>();
        resp.put("id",               saved.getId());
        resp.put("fullName",         saved.getFullName());
        resp.put("passportNumber",   saved.getPassportNumber());
        resp.put("email",            saved.getEmail());
        resp.put("phone",            saved.getPhone());
        resp.put("seatNumber",       saved.getSeatNumber());
        resp.put("bookingStatus",    saved.getBookingStatus());
        resp.put("flightId",         flight.getId());
        resp.put("flightNumber",     flight.getFlightNumber());
        resp.put("origin",           flight.getOrigin());
        resp.put("destination",      flight.getDestination());
        resp.put("departureTime",    flight.getDepartureTime().toString());
        resp.put("arrivalTime",      flight.getArrivalTime().toString());
        resp.put("price",            flight.getPrice());
        resp.put("bookedById",       bookedBy.getId());
        resp.put("bookedByUsername", bookedBy.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    // ── My Bookings (user-scoped) ─────────────────────────────────────────────

    /**
     * GET /api/flights/bookings
     * Returns ONLY the bookings that belong to the currently logged-in user.
     * Uses findByBookedById so the DB does the filtering — never returns
     * another user's data.
     */
    @GetMapping("/bookings")
    @Transactional
    public ResponseEntity<?> getMyBookings(HttpServletRequest request) {
        Long userId = getSessionUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }

        List<Passenger> passengers = passengerRepository.findByBookedById(userId);
        List<Map<String, Object>> result = buildBookingDtoList(passengers);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/flights/bookings/all  — Admin: all bookings across all users.
     */
    @GetMapping("/bookings/all")
    @Transactional
    public ResponseEntity<?> getAllBookings(HttpServletRequest request) {
        Long userId = getSessionUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }

        List<Passenger> passengers = passengerRepository.findAll();
        List<Map<String, Object>> result = buildBookingDtoList(passengers);
        return ResponseEntity.ok(result);
    }

    /**
     * DELETE /api/flights/bookings/{bookingId}
     * A user can only cancel their own booking.
     */
    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<Map<String, Object>> cancelBooking(
            @PathVariable Long bookingId,
            HttpServletRequest request) {

        Long userId = getSessionUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }

        Passenger booking = passengerRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Booking not found"));
        }

        // Ownership check — users can only cancel their own bookings
        if (!booking.getBookedBy().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "You are not allowed to cancel this booking"));
        }

        passengerRepository.deleteById(bookingId);
        return ResponseEntity.ok(Map.of("message", "Booking " + bookingId + " cancelled"));
    }

    // ── Shared DTO builder ────────────────────────────────────────────────────

    private List<Map<String, Object>> buildBookingDtoList(List<Passenger> passengers) {
        return passengers.stream().map(p -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id",             p.getId());
            m.put("fullName",       p.getFullName());
            m.put("passportNumber", p.getPassportNumber());
            m.put("email",          p.getEmail());
            m.put("phone",          p.getPhone());
            m.put("seatNumber",     p.getSeatNumber());
            m.put("bookingStatus",  p.getBookingStatus());

            if (p.getFlight() != null) {
                Flight f = p.getFlight();
                Map<String, Object> fm = new HashMap<>();
                fm.put("id",            f.getId());
                fm.put("flightNumber",  f.getFlightNumber());
                fm.put("origin",        f.getOrigin());
                fm.put("destination",   f.getDestination());
                fm.put("departureTime", f.getDepartureTime() != null ? f.getDepartureTime().toString() : null);
                fm.put("arrivalTime",   f.getArrivalTime()   != null ? f.getArrivalTime().toString()   : null);
                fm.put("price",         f.getPrice());
                fm.put("status",        f.getStatus());
                m.put("flight", fm);
            }

            if (p.getBookedBy() != null) {
                User u = p.getBookedBy();
                m.put("bookedBy", Map.of(
                    "id",       u.getId(),
                    "username", u.getUsername(),
                    "fullName", u.getFullName()
                ));
            }

            return m;
        }).toList();
    }
}
