package com.example.remeet.entity;

import com.sun.istack.NotNull;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Data
@Entity
@Builder
@DynamicInsert
@Table(name = "UPLOADED_VIDEO")
public class UploadedVideoEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="video_no")
    private Integer videoNo;

    @NotNull
    @Column(name="video_path")
    private String videoPath;

    @NotNull
    @ManyToOne
    @JoinColumn(name="conversation_no")
    private ModelBoardEntity conversationNo;
}
