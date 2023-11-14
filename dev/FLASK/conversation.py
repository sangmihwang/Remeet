from __future__ import print_function
import tempfile
from google.oauth2 import service_account
from google.cloud import speech
from flask import Flask, jsonify, request
from pydub import AudioSegment
import requests
import boto3
import wave
import os
from pydub import AudioSegment
from werkzeug.utils import secure_filename
import ffmpeg
import json
from flask_cors import CORS
import logging
from moviepy.editor import VideoFileClip,concatenate_videoclips, concatenate_audioclips, clips_array, ImageClip, AudioFileClip

app = Flask(__name__)
# .env 파일에서 환경 변수를 로드합니다.
CORS(app)
app.logger.setLevel(logging.INFO)

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
x_api_key = os.getenv("x_api_key")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
key_path = "C:/Users/SSAFY/Desktop/자율/dev/FLASK/google.json"

REGION_NAME = "ap-northeast-2"
BUCKET_NAME = "remeet"
ALLOWED_EXTENSIONS = {
    "txt",
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "gif",
    "mp4",
    "wav",
    "mp3",
    "mp4",
    "avi",
    "mov",
    "flv",
    "wmv",
}

# S3 클라이언트 설정
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION_NAME,
)


######
# Function to download video from S3
def download_from_s3(bucket, object_name, local_file_path):
    s3_client.download_file(bucket, object_name, local_file_path)


# Function to create hologram video and upload to S3
def make_hologram_video(input_video_path, bucket_name, s3_file_path):
    # Load video
    clip = VideoFileClip(input_video_path)
    duration = clip.duration
    transparent_clip = (
        ImageClip("transparent.png", duration=duration)
        .set_opacity(0)
        .resize(height=clip.size[1])
    )

    # Create hologram effect
    top_clip = clip.rotate(angle=45, resample="bicubic")
    bottom_clip = clip.rotate(angle=315, resample="bicubic")
    left_clip = clip.rotate(angle=135, resample="bicubic")
    right_clip = clip.rotate(angle=225, resample="bicubic")
    final_clip = clips_array([[top_clip, bottom_clip], [left_clip, right_clip]])

    # Use a temporary file for output to ensure it's deleted after use
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_output_video:
        output_video_path = temp_output_video.name
        # final_clip = clips_array([...])  # Your clips array logic
        final_clip.write_videofile(output_video_path, codec="libx264")

        # Upload to S3
        s3_client.upload_file(output_video_path, bucket_name, s3_file_path)

    # Delete the temporary output file
    os.remove(output_video_path)


# Flask route to process video
@app.route("/process-video", methods=["POST"])
def process_video():
    data = request.json
    path = data["path"]
    input_object_name = path + "merged_video.mp4"
    s3_output_path = path + "holo_video.mp4"
    bucket_name = BUCKET_NAME

    # Use a temporary file for input to ensure it's deleted after use
    with tempfile.NamedTemporaryFile(delete=True) as temp_input_video:
        input_video_path = temp_input_video.name
        download_from_s3(bucket_name, input_object_name, input_video_path)
        # Process the video and upload to S3
        make_hologram_video(input_video_path, bucket_name, s3_output_path)

    return jsonify({"message": "Video processed and uploaded successfully."})


#######


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def convert_blob_to_wav(blob_path, output_path):
    sound = AudioSegment.from_file(blob_path, format="webm")
    sound.export(output_path, format="wav")


def get_wav_info(wav_filename):
    with wave.open(wav_filename, "rb") as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        duration = n_frames / framerate

        return {
            "channels": n_channels,
            "sampwidth": sampwidth,
            "framerate": framerate,
            "n_frames": n_frames,
            "duration": duration,
        }


# Heygen API 관련
# Heygen API 관련


def commonvideoMaker(avatar_id, admin):
    app.logger.info("HEYGEN_COMMON_VIDEO API ATTEMPT")
    global x_api_key
    test = False if admin else True
    # talking photo ID를 선택해 기본 영상(Silent Video) 생성
    url_silent = "https://api.heygen.com/v2/video/generate"
    payload_silent = {
        "test": test,
        "caption": False,
        "dimension": {"width": 1920, "height": 1080},
        "video_inputs": [
            {
                "character": {"type": "talking_photo", "talking_photo_id": avatar_id},
                "voice": {
                    "type": "audio",
                    "audio_url": "https://resource.heygen.com/silent.mp3",
                },
            }
        ],
    }

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "x-api-key": x_api_key,
    }

    response_silent = requests.post(url_silent, json=payload_silent, headers=headers)

    tmp = json.loads(response_silent.text)
    video_id = tmp["data"]["video_id"]
    video_url = f"https://api.heygen.com/v1/video_status.get?video_id={video_id}"

    video_headers = {"accept": "application/json", "x-api-key": x_api_key}

    while True:
        response = requests.get(video_url, headers=video_headers)
        result = json.loads(response.text)
        if result["data"]["video_url"]:
            break
        print("not yet")

    return result["data"]["video_url"]


@app.route("/api/v1/heyVoiceId", methods=["POST"])
def getVoiceId():
    app.logger.info("HEYGEN_VIDEO_ID API ATTEMPT")
    global x_api_key
    voice_name = request.json.get("type")
    hey_headers = {"accept": "application/json", "x-api-key": x_api_key}
    # talking photo ID 전체조회
    # url_avatar = "https://api.heygen.com/v1/talking_photo.list"
    # avatar_list = requests.get(url_avatar, headers=hey_headers)
    # voice ID 전체조회
    url_voice = "https://api.heygen.com/v1/voice.list"
    voice_list = requests.get(url_voice, headers=hey_headers)
    voice_json = json.loads(voice_list.text)

    # voice name으로 voice ID 조회
    voice_id = "none"
    voice_data = voice_json.get("data")
    for voice in voice_data["list"]:
        if voice["display_name"] == voice_name:
            voice_id = voice["voice_id"]
            break

    return jsonify({"answer": voice_id, "url": voice_id}), 200


def videoMaker(text, voice_id, avatar_id, admin):
    app.logger.info("HEYGEN_VIDEO_MAKER API ATTEMPT")
    global x_api_key
    test = False if admin else True
    # voice ID 와 talking photo ID를 선택해 input text로 영상 생성
    url_avatar = "https://api.heygen.com/v1/video.generate"
    payload_avatar = {
        "background": "#000000",
        "ratio": "16:9",
        "test": test,
        "version": "v1alpha",
        "clips": [
            {
                "avatar_style": "normal",
                "caption": False,
                "input_text": text,
                "scale": 1,
                "voice_id": voice_id,
                "talking_photo_style": "normal",
                "talking_photo_id": avatar_id,
            }
        ],
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "x-api-key": x_api_key,
    }
    while True:
        response_avatar = requests.post(
            url_avatar, json=payload_avatar, headers=headers
        )
        tmp = json.loads(response_avatar.text)
        print(tmp)
        if tmp["data"]:
            video_id = tmp["data"]["video_id"]
            break
        print("not yet, id")

    video_url = f"https://api.heygen.com/v1/video_status.get?video_id={video_id}"

    video_headers = {"accept": "application/json", "x-api-key": x_api_key}

    while True:
        response = requests.get(video_url, headers=video_headers)
        result = json.loads(response.text)
        if result["data"]["video_url"]:
            break
        print("not yet, url")

    return result["data"]["video_url"]


# GPT 관련
# GPT 관련


def gpt_answer(model_name, conversation_text, input_text):
    app.logger.info("GPT API ATTEMPT")
    global OPENAI_API_KEY

    first_setting = """
    너는 {0} 인척 나랑 대화를 해야해. {0}은 죽었어.
    평소 {0}와 나의 대화가 있어.
    """.format(
        model_name
    )

    last_setting = """
    여기까지가 평소 나와 {0}의 대화야, 무조건 반말로,
    이 대화에서 {0}의 말투를 따라해서, 내 말에 {0}처럼 한개의 문장만 대답해줘
    """.format(
        model_name
    )

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
        json={
            "model": "gpt-3.5-turbo",
            "messages": [
                # system = 사용자가 입력하는 인물, 성격, 특징
                {
                    "role": "system",
                    "content": first_setting + conversation_text + last_setting,
                },
                {"role": "user", "content": input_text},
            ],
        },
    )
    chat_response = (
        response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
    )

    if f"{model_name}:" in chat_response:
        chat_response = chat_response.split(":")[-1]

    return chat_response


# ELEVENLABS 관련
# ELEVENLABS 관련


def make_voice(model_name, gender, audio_files):
    app.logger.info("MAKE_VOICE API ATTEMPT")
    make_voice_url = "https://api.elevenlabs.io/v1/voices/add"

    if gender == 'M':
        gender_label = 'male'
    elif gender == 'F':
        gender_label = 'female'
    else:
        raise ValueError("Invalid gender value")

    headers = {"Accept": "application/json", "xi-api-key": ELEVENLABS_API_KEY}

    data = {
        "name": model_name,
        "labels": f'{{"gender": "{gender_label}"}}',
        "description": f"{model_name} Voice TestModel",
    }

    response = requests.post(
        make_voice_url, headers=headers, data=data, files=audio_files
    )
    response.raise_for_status()
    json_response = response.json()

    if "voice_id" not in json_response:
        raise ValueError("Error: 보이스 id를 반환하지 못함.")

    return json_response["voice_id"]


def make_tts(ele_voice_id, text, user_no, model_no, conversation_no):
    app.logger.info("TTS API ATTEMPT")
    stability, similarity_boost = 0.5, 0.75
    # voice_id = request.json.get('voiceId')
    # text = request.json.get('answer')
    tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{ele_voice_id}/stream"

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "xi-api-key": "0cd38d1a7e725419c3599d6db9f58885",
    }

    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": stability,
            "similarity_boost": similarity_boost,
        },
    }

    response = requests.post(tts_url, json=data, headers=headers, stream=True)

    # API 응답 상태 확인
    if response.status_code != 200:
        print(f"Error! HTTP Status Code: {response.status_code}")
        print(response.text)
        exit()
    output_folder = os.path.join("samples", f"{user_no}_{model_no}_{conversation_no}")
    os.makedirs(output_folder, exist_ok=True)

    # S3 버킷에서 기존 파일 목록 가져오기
    folder_key = f"ASSET/{user_no}/{model_no}/{conversation_no}"
    output_file = find_index(folder_key, "mp3")
    output_path = os.path.join(output_folder, output_file)

    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)

    file_path = os.path.join(folder_key, output_file)
    try:
        # 파일을 S3에 업로드
        with open(output_path, "rb") as file:
            s3_client.upload_fileobj(file, BUCKET_NAME, file_path)
        file_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": BUCKET_NAME, "Key": file_path},
            ExpiresIn=3600,
        )
        return file_url
    except Exception as e:
        print(str(e))
        app.logger.info("TTS API Response result : ", 500, "- Failed to upload file")
        return jsonify({"error": "Failed to upload file"}), 500


# 파일 업로드 API
# 파일 업로드 API


@app.route("/api/v1/upload/files", methods=["POST"])
def upload_files():
    app.logger.info("UPLOAD_FILES API ATTEMPT")
    if "files" not in request.files:
        app.logger.info("UPLOAD_FILES API Response result : ", 400, "- No file part")
        return jsonify(error="No file part"), 400

    files = request.files.getlist("files")
    userNo = request.form.get("userNo")
    modelNo = request.form.get("modelNo")
    fileType = request.form.get("type")
    responses = []
    for file in files:
        if file.filename == "":
            responses.append("no filename")
            continue
        if file and allowed_file(file.filename):
            folder_key = f"ASSET/{userNo}/{modelNo}/"
            temp_blob_path = secure_filename(file.filename)  # 안전한 파일 이름 사용
            file.save(temp_blob_path)

            def convert_audio_to_mp3(source_path, target_path):
                audio = AudioSegment.from_file(source_path)
                # 필요한 경우, 샘플 레이트, 채널 등을 조정
                audio.export(target_path, format="mp3")

            def convert_video_to_mp4(source_path, target_path):
                if source_path == target_path:
                    target_path = "tmp" + target_path
                    ffmpeg.input(source_path).output(
                        target_path, vcodec="libx264", acodec="aac"
                    ).run(overwrite_output=True)

            if fileType == "voice" and file.filename.split(".")[1].lower() != "mp3":
                new_path = f'{file.filename.split(".")[0]}' + ".mp3"
                convert_audio_to_mp3(temp_blob_path, new_path)
            elif fileType == "video" and file.filename.split(".")[1].lower() != "mp4":
                new_path = f'{file.filename.split(".")[0]}.mp4'
                convert_video_to_mp4(temp_blob_path, new_path)
            else:
                new_path = file.filename
            try:
                # 저장된 pcm 파일을 S3에 업로드
                with open(new_path, "rb") as file:
                    s3_client.upload_fileobj(file, BUCKET_NAME, folder_key + new_path)
                os.remove(new_path)  # 임시 파일 삭제
                s3_url = f"https://remeet.s3.ap-northeast-2.amazonaws.com/{folder_key + new_path}"
                responses.append(s3_url)
            except Exception as e:
                app.logger.info("UPLOAD_FILES API Response result : ", str(e))
                responses.append("Failed to upload file")

            # 각 파일 처리에 대한 응답을 저장
        else:
            responses.append("Invalid file type")
    return jsonify({"fileList": responses})


# STT API
# STT API


@app.route("/api/v1/transcribe", methods=["POST"])
def transcribe_audio():
    app.logger.info("STT API ATTEMPT")
    if "file" not in request.files:
        app.logger.info("STT API Response result : ", 400, "- No file part")
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        app.logger.info("STT API Response result : ", 400, "- No selected file")
        return jsonify({"error": "No selected file"}), 400

    if file:
        # 파일을 임시 디렉토리에 저장
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_blob_path = os.path.join(temp_dir, "temp_blob_data.webm")
            file.save(temp_blob_path)
            #
            # .wav 파일로 변환
            temp_wav_path = os.path.join(temp_dir, "temp_info_check.wav")
            audio = AudioSegment.from_file(temp_blob_path)
            audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
            audio.export(temp_wav_path, format="wav", codec="pcm_s16le")
            # 변환된 .wav 파일을 읽어오기
            with open(temp_wav_path, "rb") as audio_file:
                audio_content = audio_file.read()
                try:
                    # 오디오 파일을 텍스트로 변환
                    credentials = service_account.Credentials.from_service_account_file(
                        key_path
                    )
                    client = speech.SpeechClient(credentials=credentials)

                    audio = speech.RecognitionAudio(content=audio_content)
                    config = speech.RecognitionConfig(
                        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                        sample_rate_hertz=16000,
                        language_code="ko-KR",
                    )

                    response = client.recognize(config=config, audio=audio)

                    # 변환된 텍스트를 수집
                    transcripts = [
                        result.alternatives[0].transcript for result in response.results
                    ]
                    return jsonify({"result": transcripts[0]}), 200
                except response.GoogleAPICallError as e:
                    app.logger.info(
                        "STT API Response result : ", 500, "- Error calling Google API"
                    )
                    return jsonify({"error": "Error calling Google API"}), 500
                except response.RetryError as e:
                    app.logger.info(
                        "STT API Response result : ",
                        500,
                        "- Error with API retry logic",
                    )
                    return jsonify({"error": "Error with API retry logic"}), 500
                except response.TooManyRequests as e:
                    app.logger.info(
                        "STT API Response result : ",
                        429,
                        "- Too many requests to the API",
                    )
                    return jsonify({"error": "Too many requests to the API"}), 429

            # 임시 파일은 이 블록을 벗어나면 자동으로 삭제됩니다.
    app.logger.info("STT API Response result : ", 400, "- Invalid file")
    return jsonify({"error": "Invalid file"}), 400


# VOICE MODEL 생성 API
# VOICE MODEL 생성 API


@app.route("/api/v1/conversation/makevoice", methods=["POST"])
def make_voice_model():
    app.logger.info("MAKE_VOICE API ATTEMPT")
    model_name = request.form.get("modelName")
    gender_label = request.form.get("gender")
    audio_file_paths = request.form.getlist("filePaths")
    # audio_file_paths = request.json.get("filePaths")

    bucket_name = BUCKET_NAME
    # S3에서 오디오 파일 다운로드
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            local_audio_files = []
            for file_path in audio_file_paths:
                relative_path = file_path.split('amazonaws.com/')[1]
                local_filename = relative_path.split('/')[-1]
                local_file_path = os.path.join(temp_dir, local_filename)
                local_audio_files.append(local_file_path)
                s3_client.download_file(bucket_name, relative_path, local_file_path)

            files = [
                ("files", (os.path.basename(file), open(file, 'rb'), "audio/mpeg")) for file in local_audio_files
            ]

            voice_id = make_voice(model_name, gender_label, files)
            return jsonify({"voice_id": voice_id})
    except Exception as e:
        app.logger.error(f"에러 발생: {e}")
        return jsonify({"error": str(e)}), 500


# AVATAR 생성 API
@app.route("/api/v1/createAvatarID", methods=["POST"])
def upload_avatar():
    app.logger.info("CREATE_AVATAR_ID API ATTEMPT")
    # Avatar로 사용할 사진 업로드
    x_api_key = os.getenv("x_api_key")
    if "file" not in request.files:
        app.logger.info(
            "CREATE_AVATAR_ID API Response result : ", 400, "- No file part"
        )
        return jsonify(error="No file part"), 400
    file = request.files["file"]
    if file.filename == "":
        app.logger.info(
            "CREATE_AVATAR_ID API Response result : ", 400, "- No selected file"
        )
        return jsonify(error="No selected file"), 400
    # files = {'file': (file.filename, file, 'image/jpeg')}
    temp_blob_path = secure_filename(file.filename)  # 안전한 파일 이름 사용
    file.save(temp_blob_path)

    def convert_image_to_jpeg(source_path, target_path):
        if source_path == target_path:
            target_path = "tmp_" + os.path.basename(target_path)
        ffmpeg.input(source_path).output(
            target_path, format="image2", vcodec="mjpeg"
        ).run(overwrite_output=True)

    if allowed_file(file):
        new_path = file.filename
    else:
        new_path = f'{file.filename.split(".")[0]}.jpeg'
        convert_image_to_jpeg(temp_blob_path, new_path)
    with open(new_path, "rb") as file:
        resp = requests.post(
            "https://upload.heygen.com/v1/talking_photo",
            data=file,  # 파일의 내용을 읽어서 줘야함
            headers={"Content-Type": "image/jpeg", "x-api-key": x_api_key},
        )
    return jsonify({"result": resp.json()["data"]["talking_photo_id"]}), 200


# Function to create hologram video and upload to S3
def make_hologram_video(input_video_path, bucket_name, s3_file_path):
    # Load video
    clip = VideoFileClip(input_video_path)

    # Create hologram effect
    top_clip = clip.rotate(angle=45, resample="bicubic")
    bottom_clip = clip.rotate(angle=315, resample="bicubic")
    left_clip = clip.rotate(angle=135, resample="bicubic")
    right_clip = clip.rotate(angle=225, resample="bicubic")
    final_clip = clips_array([[top_clip, bottom_clip], [left_clip, right_clip]])

    # Use a temporary file for output to ensure it's deleted after use
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_output_video:
        output_video_path = temp_output_video.name
        # final_clip = clips_array([...])  # Your clips array logic
        final_clip.write_videofile(output_video_path, codec="libx264")

        # Upload to S3
        s3_client.upload_file(output_video_path, bucket_name, s3_file_path)

    # Delete the temporary output file
    os.remove(output_video_path)


# Flask route to process video
# @app.route("/process-video", methods=["POST"])
def process_video(path, userNo, modelNo, name):
    app.logger.info("process_video API ATTEMPT")
    s3_output_path = f"ASSET/{userNo}/{modelNo}/" + name
    bucket_name = BUCKET_NAME

    make_hologram_video(path, bucket_name, s3_output_path)
    s3_url = f"https://remeet.s3.ap-northeast-2.amazonaws.com/{s3_output_path}"
    return s3_url


# 기본 영상 생성 API
# 기본 영상 생성 API
@app.route("/api/v1/conversation/commonvideo", methods=["POST"])
def make_common_video():
    app.logger.info("MAKE_COMMON_VIDEO API ATTEMPT")
    # 대화상대의 Heygen Talking Photo ID
    avatar = request.json.get("avatarId")
    voice = request.json.get("heyVoiceId")
    userNo = request.json.get("userNo")
    modelNo = request.json.get("modelNo")
    is_admin = request.json.get("admin")
    commonVideoPath = commonvideoMaker(avatar, is_admin)
    holoUrl = process_video(commonVideoPath, userNo, modelNo, "holo_video.mp4")
    answer = "안녕하세요! 저는 인공지능 기술의 발전에 대해 이야기하고 싶어요. 우리는 지금 인공지능이 우리 일상 속에 깊숙이 들어와 있다는 것을 실감하고 있죠. 예를 들어, 스마트폰에서 음성 인식 기능을 사용하거나, 온라인 쇼핑을 할 때 개인 맞춤형 추천을 받는 것 모두 인공지능 덕분입니다 하지만 인공지능 기술은 여기서 멈추지 않아요. 앞으로 우리는 더욱 똑똑하고, 더욱 인간처럼 반응하는 인공지능을 만나게 될 거예요."
    videoPath = videoMaker(answer, voice, avatar, is_admin)
    holoUrl2 = process_video(videoPath, userNo, modelNo, "holo_moving.mp4")
    return (
        jsonify(
            {
                "commonVideoPath": commonVideoPath,
                "commonHoloPath": holoUrl,
                "movingVideoPath": videoPath,
                "movingHoloPath": holoUrl2,
            }
        ),
        200,
    )


# video 기반 대화 생성 API
# video 기반 대화 생성 API
@app.route("/api/v1/conversation/video", methods=["POST"])
def make_conversation_video():
    app.logger.info("CONVERSATION_VIDEO API ATTEMPT")
    input_text = request.json.get("question")
    model_name = request.json.get("modelName")
    conversation_text = request.json.get("conversationText")
    answer = gpt_answer(model_name, conversation_text, input_text)
    voice = request.json.get("heyVoiceId")
    avatar = request.json.get("avatarId")
    is_admin = request.json.get("admin")
    videoPath = videoMaker(answer, voice, avatar, is_admin)
    return jsonify({"answer": answer, "url": videoPath})


# voice 기반 대화 생성 API
# voice 기반 대화 생성 API
@app.route("/api/v1/conversation/voice", methods=["POST"])
def make_conversation_voice():
    try:
        app.logger.info("CONVERSATION_VIDEO API ATTEMPT")
        input_text = request.json.get("question")
        model_name = request.json.get("modelName")
        conversation_text = request.json.get("conversationText")
        answer = gpt_answer(model_name, conversation_text, input_text)
        ele_voice_id = request.json.get("eleVoiceId")
        user_no = request.json.get("userNo")
        model_no = request.json.get("modelNo")
        conversation_no = request.json.get("conversationNo")
        voice_url = make_tts(ele_voice_id, answer, user_no, model_no, conversation_no)
        print(answer, input_text)
        return jsonify({"answer": answer, "url": voice_url})

    except Exception as e:
        app.logger.info("CONVERSATION_VIDEO API Response result : ", 500, "-", str(e))
        return jsonify({"error": str(e)}), 500


# 회원가입 image 저장 API
# 회원가입 image 저장 API
@app.route("/api/v1/signup", methods=["POST"])
def signup_image():
    app.logger.info("SIGNUP_IMAGE API ATTEMPT")
    key = AWS_ACCESS_KEY_ID[:6]
    app.logger.info(key)
    if "file" not in request.files:
        app.logger.info("SIGNUP_IMAGE API Response result : ", 403, "- No file part")
        return jsonify({"error": "No file part"}), 403

    file = request.files.get("file")

    if file:
        folder_key = f"PROFILE/"
        type = file.filename.split(".")[-1]
        new_path = find_index(folder_key, type)
        file.save(new_path)
        try:
            # 저장된 pcm 파일을 S3에 업로드
            with open(new_path, "rb") as file:
                s3_client.upload_fileobj(file, BUCKET_NAME, folder_key + new_path)
            os.remove(new_path)  # 임시 파일 삭제
            s3_url = f"https://remeet.s3.ap-northeast-2.amazonaws.com/{folder_key + new_path}"
            return jsonify({"result": s3_url}), 200
        except Exception as e:
            app.logger.info("SIGNUP_IMAGE API Response result : ", 405, "-", str(e))
            return jsonify({"error": e}), 405
        # 각 파일 처리에 대한 응답을 저장
    else:
        app.logger.info("SIGNUP_IMAGE API Response result : ", 403, "- No file part")
        return jsonify({"error": "No file part"}), 403

def find_index(folder_key, type):
    existing_files = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=folder_key)
    existing_file_keys = [
        obj["Key"]
        for obj in existing_files.get("Contents", [])
        if obj["Key"].endswith("."+type)
    ]

    # 새 파일 이름 생성
    existing_indices = [
        int(key.split("/")[-1].split(".")[0])
        for key in existing_file_keys
        if key.split("/")[-1].split(".")[0].isdigit()
    ]
    next_index = 1 if not existing_indices else max(existing_indices) + 1
    output_file = f"{next_index}."+type
    return output_file


def merge_video_audio(videoPath, audioPath, folder_key):
    video_clip = VideoFileClip(videoPath)
    audio_clip = AudioFileClip(audioPath)
    audio_duration = audio_clip.duration
    video_clip = video_clip.without_audio()
    video_clip = video_clip.subclip(0, audio_duration)
    final_clip = video_clip.set_audio(audio_clip)
    
    output_file = find_index(folder_key, "mp4")

    final_clip.write_videofile(output_file, codec="libx264", audio_codec="aac")

    return output_file


@app.route('/api/v1/upload/talking', methods=["POST"])
def question_upload():
    app.logger.info("QEUSTION_UPLOAD API ATTEMPT")
    if "file" not in request.files:
        app.logger.info("QEUSTION_UPLOAD API Response result : ", 400, "- No file part")
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    url = request.form.get("url")
    type = request.form.get("type")
    userNo = request.form.get("userNo")
    modelNo = request.form.get("modelNo")
    conversationNo = request.form.get("conversationNo")
    if file.filename == "":
        app.logger.info("QEUSTION_UPLOAD API Response result : ", 400, "- No selected file")
        return jsonify({"error": "No selected file"}), 400

    if file:
        # 파일을 임시 디렉토리에 저장
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_blob_path = os.path.join(temp_dir, "temp_blob_data.webm")
            file.save(temp_blob_path)
            #
            # .wav 파일로 변환
            def convert_audio_to_mp3(source_path, target_path):
                audio = AudioSegment.from_file(source_path)
                # 필요한 경우, 샘플 레이트, 채널 등을 조정
                audio.export(target_path, format="mp3")
            folder_key = f"ASSET/{userNo}/{modelNo}/{conversationNo}"
            
            with tempfile.TemporaryDirectory() as temp_dir:
                if type == "voice":
                    output_file = find_index(folder_key, "mp3")
                    temp_wav_path = os.path.join(temp_dir, output_file)
                    convert_audio_to_mp3(temp_blob_path,temp_wav_path)
                else :
                    new_url = url.split('ASSET')[1]
                    local_file_path = os.path.join(temp_dir, "tmp_video.mp4")
                    s3_client.download_file(BUCKET_NAME,'ASSET'+new_url, local_file_path)
                    output_file = find_index(folder_key, "mp4")
                    temp_wav_path = os.path.join(temp_dir, output_file)
                    merge_video_audio(local_file_path, temp_wav_path, temp_wav_path)
                    
                try:
                    with open(temp_wav_path, "rb") as file:
                        s3_client.upload_fileobj(file, BUCKET_NAME, folder_key + output_file)
                        os.remove(temp_wav_path)
                        s3_url = f"https://remeet.s3.ap-northeast-2.amazonaws.com/{folder_key + output_file}"
                        return jsonify({"result": s3_url}), 200
                except Exception as e:
                    app.logger.info("QEUSTION_UPLOAD API Response result : ", 405, "-", str(e))
                    return jsonify({"error": e}), 405
    else:
        app.logger.info("QEUSTION_UPLOAD API Response result : ", 403, "- No file part")
        return jsonify({"error": "No file part"}), 403

@app.route('/api/v1/combinResult', methods=['POST'])
def combin_result():
    app.logger.info("COMBIN_RESULT API ATTEMPT")
    # 다운로드할 영상 파일 목록
    userNo = request.json.get("userNo")
    modelNo = request.json.get("modelNo")
    conversationNo = request.json.get("conversationNo")
    type = request.json.get("type")
    folder_key = f"ASSET/{userNo}/{modelNo}/{conversationNo}/"
    response = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=folder_key)

    if response['KeyCount'] > 0:
        files = [item['Key'] for item in sorted(response['Contents'], key=lambda x: x['LastModified'], reverse=False)]
    else:
        return jsonify({"error": "No videos found"}), 404
    # 로컬 시스템에 저장할 파일의 경로와 이름
    local_paths = []
    with tempfile.TemporaryDirectory() as temp_dir:

        for i in range(1, len(files)):
            local_filename = files[i].split('/')[-1]
            local_file_path = os.path.join(temp_dir, local_filename)
            local_paths.append(local_file_path)
            s3_client.download_file(BUCKET_NAME, files[i], local_file_path)

        if type == 'mp4':
            merged_file_path = os.path.join(temp_dir, "merged_video.mp4")
            video_clips = [VideoFileClip(path) for path in local_paths]
            final_clip = concatenate_videoclips(video_clips)
            final_clip.write_videofile(merged_file_path)
            new_path = folder_key + "merged_video.mp4"
        
        elif type == 'mp3' :
            merged_file_path = os.path.join(temp_dir, "merged_audio.mp3")
            audio_clips = [AudioFileClip(path) for path in local_paths]
            final_clip = concatenate_audioclips(audio_clips)
            final_clip.write_audiofile(merged_file_path)
            new_path = folder_key + "merged_audio.mp3"
        
        try:
            # 병합된 파일을 S3에 업로드
            with open(merged_file_path, "rb") as file:
                s3_client.upload_fileobj(file, BUCKET_NAME, new_path)
            os.remove(merged_file_path)  # 임시 파일 삭제
            s3_url = f"https://remeet.s3.ap-northeast-2.amazonaws.com/{new_path}"
            return jsonify({'anwer': s3_url, 'url': s3_url}), 200
        except Exception as e:
            error_message = str(e)
            app.logger.info("API Response result : ", 405, "-", error_message)
            return jsonify({'error': error_message}), 405


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
