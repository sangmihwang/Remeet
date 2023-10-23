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
@Table(name = "USER")
public class UserEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="user_no")
    private Integer userNo;

    @NotNull
    @Column(name="user_name")
    private String userName;

    @NotNull
    @Column(name="user_id")
    private String userId;

    @NotNull
    @Column(name="password")
    private String password;

    @NotNull
    @Column(name="profile_img")
    private String profileImg;

}
