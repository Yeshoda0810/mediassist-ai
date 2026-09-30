package com.yeshoda.medical.model;

import jakarta.persistence.*;

@Entity
public class Doctor {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String name;
 @Column(nullable=false) private String specialty;
 private String qualification; private Integer experience; private String hospital; private String location;
 public Doctor(){}
 public Doctor(String name,String specialty,String qualification,Integer experience,String hospital,String location){this.name=name;this.specialty=specialty;this.qualification=qualification;this.experience=experience;this.hospital=hospital;this.location=location;}
 public Long getId(){return id;} public String getName(){return name;} public void setName(String v){name=v;} public String getSpecialty(){return specialty;} public void setSpecialty(String v){specialty=v;}
 public String getQualification(){return qualification;} public Integer getExperience(){return experience;} public String getHospital(){return hospital;} public String getLocation(){return location;}
}
