package com.example.remeet.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import io.netty.handler.codec.EncoderException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ws.schild.jave.*;
import ws.schild.jave.encode.AudioAttributes;
import ws.schild.jave.encode.EncodingAttributes;

import javax.sound.sampled.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UploadService {
    @Value("${cloud.aws.s3.bucket}")
    private String S3Bucket; // Bucket 이름

    @Autowired
    AmazonS3Client amazonS3Client;

    public String upload(MultipartFile blobData) throws IOException, EncoderException,ws.schild.jave.EncoderException {
        // Convert the blob to PCM 16bit WAV
        File convertedFile = handleFileUpload(blobData);

        FileInputStream fileInputStream = new FileInputStream(convertedFile);
        ObjectMetadata objectMetaData = new ObjectMetadata();
        objectMetaData.setContentType("audio/wav");
        objectMetaData.setContentLength(convertedFile.length());

        String originalName = "converted_" + blobData.getOriginalFilename() + ".wav"; // 변경된 파일 이름

        // S3에 업로드
        amazonS3Client.putObject(
                new PutObjectRequest(S3Bucket, originalName, fileInputStream, objectMetaData)
                        .withCannedAcl(CannedAccessControlList.PublicRead)
        );

        fileInputStream.close();
        convertedFile.delete(); // 임시 파일 삭제

        String wavPath = "s3://" + S3Bucket + "/" + originalName;
        return wavPath;
    }

    private File handleFileUpload(MultipartFile blobData) throws IOException, ws.schild.jave.EncoderException {
        File tempFile = File.createTempFile("temp", "wav");
        blobData.transferTo(tempFile);

        File convertedFile = convertToPCM16BitWAV(tempFile);

        tempFile.delete();

        return convertedFile;
    }

    private File convertToPCM16BitWAV(File sourceFile) throws EncoderException, ws.schild.jave.EncoderException {
        File target = new File(sourceFile.getAbsolutePath() + ".wav");
        AudioAttributes audio = new AudioAttributes();
        audio.setCodec("pcm_s16le");
        audio.setBitRate(16000);
        audio.setChannels(1);
        audio.setSamplingRate(44100);
        EncodingAttributes attrs = new EncodingAttributes();
        attrs.setOutputFormat("wav");
        attrs.setAudioAttributes(audio);
        Encoder encoder = new Encoder();
        encoder.encode(new MultimediaObject(sourceFile), target, attrs);
        return target;
    }
}
