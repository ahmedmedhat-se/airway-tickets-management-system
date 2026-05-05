-- Database Creation
DROP DATABASE IF EXISTS airway_tickets_management_system_db;
CREATE DATABASE airway_tickets_management_system_db;
USE airway_tickets_management_system_db;

-- Table Creation
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_username (username),
    UNIQUE KEY uk_email (email)
) ENGINE=InnoDB;

CREATE TABLE flights (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    origin VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('SCHEDULED', 'DELAYED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_flight_number (flight_number),
    KEY idx_origin_destination (origin, destination),
    KEY idx_departure_time (departure_time),
    KEY idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE passengers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    passport_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    flight_id BIGINT NOT NULL,
    seat_number VARCHAR(5) NOT NULL,
    booked_by BIGINT NOT NULL,
    booking_status ENUM('CONFIRMED', 'CANCELLED', 'CHECKED_IN') NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_passport_flight (passport_number, flight_id),
    UNIQUE KEY uk_seat_flight (seat_number, flight_id),
    KEY idx_flight_id (flight_id),
    KEY idx_booked_by (booked_by),
    KEY idx_booking_status (booking_status),
    
    CONSTRAINT fk_passenger_flight 
        FOREIGN KEY (flight_id) REFERENCES flights(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
        
    CONSTRAINT fk_passenger_user 
        FOREIGN KEY (booked_by) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;