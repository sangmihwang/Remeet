from __future__ import print_function
import tempfile
from flask import Flask, jsonify, request
import boto3
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from moviepy.editor import (
    VideoFileClip,
    concatenate_videoclips,
    concatenate_audioclips,
    clips_array,
    ImageClip,
    AudioFileClip,
)
from dotenv import load_dotenv
import logging
load_dotenv()
app = Flask(__name__)
# .env 파일에서 환경 변수를 로드합니다.
CORS(app)
app.logger.setLevel(logging.INFO)


AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

REGION_NAME = "ap-northeast-2"
BUCKET_NAME = "remeet"


# S3 클라이언트 설정
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION_NAME,
)


def merge_video_audio(videoPath, audioPath, path):
    app.logger.info("MERGE_VIDEO API ATTEMPT")
    video_clip = VideoFileClip(videoPath)
    audio_clip = AudioFileClip(audioPath)
    audio_duration = audio_clip.duration
    video_clip = video_clip.without_audio()
    video_clip = video_clip.subclip(0, audio_duration)
    final_clip = video_clip.set_audio(audio_clip)

    final_clip.write_videofile(path, codec="libx264", audio_codec="aac")
    return path

@app.route("/api/v1/mergeVideo", methods=["POST"])
def merge_video():
    app.logger.info("MERGE_VIDEO API ATTEMPT")
    url = request.json.get("url")
    voice_tts = request.json.get("voicetts")
    new_path = request.json.get("newPath")
    folder_key = request.json.get("folderKey")
    with tempfile.TemporaryDirectory() as temp_dir:
        video_url = url.split("ASSET")[1]
        video_file_path = os.path.join(temp_dir, video_url.split("/")[-1])
        s3_client.download_file(BUCKET_NAME, "ASSET" + video_url, video_file_path)
        voice_url = voice_tts.split("ASSET")[1]
        voice_file_path = os.path.join(temp_dir, voice_url.split("/")[-1])
        s3_client.download_file(BUCKET_NAME, "ASSET" + voice_url, voice_file_path)
        make_path = os.path.join(temp_dir, new_path)
        merge_video_audio(video_file_path, voice_file_path, make_path)
        with open(make_path, "rb") as file:
            s3_client.upload_fileobj(file, BUCKET_NAME, folder_key + new_path)
    s3_url = f"https://remeet.s3.ap-northeast-2.amazonaws.com/{folder_key + new_path}"
    return jsonify({"url" : s3_url})



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
