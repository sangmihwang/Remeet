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
@Table(name = "PRODUCED_VIDEO")
public class ProducedVideoEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="pro_video_no")
    private Integer proVideoNo;

    @Column(name="pro_video_name", nullable = false)
    private String proVideoName;

    @Column(name="video_path", nullable = false)
    private String videoPath;

    @Column(name="holo_path")
    private String holoPath;

    @CreatedDate
    @Column(name="create_time", columnDefinition = "TIMESTAMP")
    private LocalDateTime createdTime;

    @ManyToOne
    @JoinColumn(name="model_no", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ModelBoardEntity modelNo;
}
