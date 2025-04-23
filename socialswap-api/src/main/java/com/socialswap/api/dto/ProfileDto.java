package com.socialswap.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProfileDto {
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private String coverImageUrl;
    
    private Integer followers;
    
    private Double engagement;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Integer price;
    
    private String age;
    
    private String weeklyPosts;
    
    private Boolean isFeatured;
    
    private Boolean isHot;
    
    @NotNull(message = "Platform is required")
    private Long platformId;
    
    @NotNull(message = "Category is required")
    private Long categoryId;
}