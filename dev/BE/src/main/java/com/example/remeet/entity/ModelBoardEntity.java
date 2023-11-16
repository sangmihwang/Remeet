package com.example.remeet.entity;

import com.sun.istack.NotNull;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Data
@Entity
@Builder
@DynamicInsert
@Table(name = "MODEL_BOARD")
public class ModelBoardEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="model_no")
    private Integer modelNo;

    @NotNull
    @Column(name="model_name")
    private String modelName;

    @NotNull
    @Column(name="gender", columnDefinition = "CHAR(1)")
    private char gender;

    @NotNull
    @Column(name="image_path")
    private String imagePath;

    @Column(name="ele_voice_id")
    private String eleVoiceId;

    @Column(name="hey_voice_id")
    private String heyVoiceId;

    @Column(name="avatar_id")
    private String avatarId;

    @Column(name="common_video_path")
    private String commonVideoPath;

    @Column(name="moving_video_path")
    private String movingVideoPath;

    @Column(name="common_holo_path")
    private String commonHoloPath;

    @Column(name="moving_holo_path")
    private String movingHoloPath;

    @NotNull
    @Column(name="conversation_text", columnDefinition = "TEXT")
    private String conversationText;

    @NotNull
    @Column(name="conversation_count")
    private Integer conversationCount;

    @CreatedDate
    @Column(name="latest_conversation_time", columnDefinition = "TIMESTAMP")
    private LocalDateTime latestConversationTime;


    @NotNull
    @ManyToOne
    @JoinColumn(name="user_no")
    private UserEntity userNo;

}
