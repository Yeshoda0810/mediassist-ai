package com.yeshoda.medical.repository;
import com.yeshoda.medical.model.*; import org.springframework.data.jpa.repository.JpaRepository; import java.time.*; import java.util.*;
public interface AppointmentRepository extends JpaRepository<Appointment,Long>{List<Appointment> findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(Long patientId); boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatus(Long d,LocalDate date,LocalTime time,String status);}
