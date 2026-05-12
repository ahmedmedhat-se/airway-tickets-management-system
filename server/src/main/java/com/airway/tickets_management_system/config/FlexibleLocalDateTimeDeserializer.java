package com.airway.tickets_management_system.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

/**
 * Accepts LocalDateTime strings in any of these formats:
 *   "2025-06-01T10:30"          (datetime-local input, no seconds)
 *   "2025-06-01T10:30:00"       (with seconds)
 *   "2025-06-01T10:30:00.000"   (with milliseconds)
 */
public class FlexibleLocalDateTimeDeserializer extends StdDeserializer<LocalDateTime> {

    private static final DateTimeFormatter FORMATTER = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd'T'HH:mm")
            .optionalStart().appendPattern(":ss").optionalEnd()
            .optionalStart().appendFraction(ChronoField.NANO_OF_SECOND, 0, 9, true).optionalEnd()
            .toFormatter();

    public FlexibleLocalDateTimeDeserializer() {
        super(LocalDateTime.class);
    }

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctx) throws IOException {
        String value = p.getText().trim();
        try {
            return LocalDateTime.parse(value, FORMATTER);
        } catch (Exception e) {
            throw new IOException(
                "Cannot parse '" + value + "' as LocalDateTime. " +
                "Expected format: yyyy-MM-dd'T'HH:mm or yyyy-MM-dd'T'HH:mm:ss", e);
        }
    }
}
