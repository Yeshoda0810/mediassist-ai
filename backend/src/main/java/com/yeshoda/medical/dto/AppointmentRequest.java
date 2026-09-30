package com.yeshoda.medical.dto; import java.time.*; public record AppointmentRequest(Long patientId,Long doctorId,LocalDate date,LocalTime time,String reason) {}
