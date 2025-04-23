package com.socialswap.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageDto {
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    @NotNull(message = "Recipient is required")
    private Long toUserId;
    
    @NotNull(message = "Profile is required")
    private Long profileId;
}