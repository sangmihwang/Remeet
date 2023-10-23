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
@Table(name = "PRODUCED_VOICE")
public class ProducedVoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="provoice_Id")
    private Integer provoiceId;

    @NotNull
    @Column(name="voice_path")
    private String voicePath;

    @NotNull
//    @ManyToOne(fetch = FetchType.LAZY)
    @ManyToOne
    @Column(name="model_no")
    private ModelBoardEntity modelNo;


}
