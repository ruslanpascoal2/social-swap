package com.socialswap.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "platforms")
public class Platform {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true)
    private String name;
    
    @Column(name = "icon_class")
    private String iconClass;
    
    @Column(name = "icon_color")
    private String iconColor;
    
    @OneToMany(mappedBy = "platform", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Profile> profiles = new ArrayList<>();
}