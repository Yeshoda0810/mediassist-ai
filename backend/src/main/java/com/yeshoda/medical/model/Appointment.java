package com.yeshoda.medical.model;

import jakarta.persistence.*;
import java.time.LocalDate; import java.time.LocalTime;

@Entity
public class Appointment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private User patient;
 @ManyToOne(optional=false) private Doctor doctor;
 @Column(nullable=false) private LocalDate appointmentDate;
 @Column(nullable=false) private LocalTime appointmentTime;
 @Column(nullable=false) private String status="BOOKED";
 private String reason;
 public Appointment(){}
 public Long getId(){return id;} public User getPatient(){return patient;} public void setPatient(User v){patient=v;} public Doctor getDoctor(){return doctor;} public void setDoctor(Doctor v){doctor=v;}
 public LocalDate getAppointmentDate(){return appointmentDate;} public void setAppointmentDate(LocalDate v){appointmentDate=v;} public LocalTime getAppointmentTime(){return appointmentTime;} public void setAppointmentTime(LocalTime v){appointmentTime=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;} public String getReason(){return reason;} public void setReason(String v){reason=v;}
}
