package com.example.remeet.dto;

import lombok.Data;

@Data
public class ConversationDataDto {
    private Integer modelNo;
    private Integer conversationNo;
    private String modelName;
    private String question;
    private String heyVoiceId;
    private String avatarId;
    private String eleVoiceId;
    private String conversationText;
}
