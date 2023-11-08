package com.example.remeet.entity;

import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Data
@Entity
@Builder
@DynamicInsert
@Table(name = "PRODUCED_VOICE")
public class ProducedVoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="pro_voice_no")
    private Integer proVoiceNo;

    @Column(name="pro_voice_name", nullable = false)
    private String proVoiceName;

    @Column(name="voice_path", nullable = false)
    private String voicePath;

    @CreatedDate
    @Column(name="created_time", columnDefinition = "TIMESTAMP")
    private LocalDateTime createdTime;

//    @ManyToOne(fetch = FetchType.LAZY)
    @ManyToOne
    @JoinColumn(name="model_no", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ModelBoardEntity modelNo;


}
