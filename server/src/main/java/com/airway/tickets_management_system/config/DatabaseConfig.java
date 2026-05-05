package com.airway.tickets_management_system.config;

import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.context.annotation.Bean;

@Configuration
public class DatabaseConfig {
    
    @Bean
    public DataSource dataSource() {
    }
}