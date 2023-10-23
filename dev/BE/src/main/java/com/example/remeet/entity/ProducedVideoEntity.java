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
public class ProducedVideoEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="pro_video_no")
    private Integer proVideoNo;

    @NotNull
    @Column(name="pro_video_name")
    private String proVideoName;

    @NotNull
    @Column(name="video_path")
    private String videoPath;

    @Column(name="holo_path")
    private String holoPath;

    @CreatedDate
    private BigInteger createdTime;

    @NotNull
    @ManyToOne
    @JoinColumn(name="conversation_no")
    private ModelBoardEntity conversationNo;
}
