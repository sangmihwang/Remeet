package com.example.remeet.entity;

import com.sun.istack.NotNull;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.math.BigInteger;

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

    @Column(name="voice_id")
    private String voiceId;

    @Column(name="avartar_id")
    private String avartarId;

    @Column(name="common_video_path")
    private String commonVideoPath;

    @NotNull
    @Column(name="conversation_text", length=2000)
    private String conversationText;

    @NotNull
    @Column(name="conversation_count")
    private Integer conversationCount;

    @CreatedDate
    private BigInteger latestConversationTime;

    @NotNull
    @ManyToOne
    @JoinColumn(name="user_no")
    private UserEntity userNo;

}
