package com.airway.tickets_management_system.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airway.tickets_management_system.models.Passenger;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {

    /**
     * Returns only the bookings that belong to a specific user.
     * Spring Data JPA derives the query from the method name:
     *   SELECT p FROM Passenger p WHERE p.bookedBy.id = :userId
     */
    List<Passenger> findByBookedById(Long userId);
}
