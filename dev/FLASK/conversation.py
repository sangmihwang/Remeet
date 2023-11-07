from __future__ import print_function
import tempfile
import speech_recognition as sr
from flask import Flask, jsonify, request
from pydub import AudioSegment
import requests
import time
import boto3
import uuid
import wave
import wavio
import os
from pydub import AudioSegment
from flask import jsonify, request
from werkzeug.utils import secure_filename
import ffmpeg
import json
import numpy as np
import base64

app = Flask(__name__)
# .env 파일에서 환경 변수를 로드합니다.

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
REGION_NAME = 'ap-northeast-2'
BUCKET_NAME = 'remeet'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'wav', 'mp3', 'mp4', 'avi', 'mov', 'flv', 'wmv'}

# S3 클라이언트 설정
s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                         region_name=REGION_NAME)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def convert_blob_to_wav(blob_path, output_path):
    sound = AudioSegment.from_file(blob_path, format="webm")
    sound.export(output_path, format="wav")


def get_wav_info(wav_filename):
    with wave.open(wav_filename, 'rb') as wf:
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
            "duration": duration
        }


@app.route('/api/v1/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(error='No file part'), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify(error='No selected file'), 400

    if file and allowed_file(file.filename):
        folder_key = f"ASSET/seungwoo/minwoong/"

        # Blob 데이터를 임시 파일로 저장
        temp_blob_path = "temp_blob_data.webm"  # 이 확장자는 Blob 데이터의 형식에 따라 변경될 수 있습니다.
        file.save(temp_blob_path)
        # 문제의 원인은 file.save(temp_blob_path)를 호출한 후에 다시 file.read()를 호출하면서 발생.
        # file 객체의 내부 포인터가 파일의 끝에 위치하게 되므로, file.read()에서 아무 것도 읽지 못하게 되서, 이를 해결하기 위해서는 file 객체의 포인터를 다시 파일의 시작으로 돌려야함.
        file.seek(0)
        print(f"Uploaded file size: {os.path.getsize(temp_blob_path)} bytes")

        # Blob 데이터를 WAV 형식으로 변환
        temp_wav_path = "temp_info_check.wav"
        convert_blob_to_wav(temp_blob_path, temp_wav_path)
        print(f"Converted WAV file size: {os.path.getsize(temp_wav_path)} bytes")
        os.remove(temp_blob_path)  # 임시 Blob 파일 삭제

        # WAV 파일 정보 가져오기
        wav_info = get_wav_info(temp_wav_path)
        print(wav_info)

        # S3 버킷에서 기존 파일 목록 가져오기
        existing_files = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=folder_key)
        existing_file_keys = [obj['Key'] for obj in existing_files.get('Contents', []) if obj['Key'].endswith('.wav')]

        # 새 파일 이름 생성
        existing_indices = [int(key.split('/')[-1].split('.')[0]) for key in existing_file_keys if
                            key.split('/')[-1].split('.')[0].isdigit()]
        next_index = 1 if not existing_indices else max(existing_indices) + 1
        new_filename = f"{next_index}.wav"
        file_path = os.path.join(folder_key, new_filename)

        # Blob 데이터를 numpy 배열로 변환
        data_blob = file.read()
        print(f"Data blob length: {len(data_blob)}")
        # data_blob의 길이를 2의 배수로 만듭니다.
        if len(data_blob) % 2 == 1:
            data_blob = data_blob[:-1]
        data = np.frombuffer(data_blob, np.int16)
        print(f"Data array shape: {data.shape}")

        # # wav 파일로 저장
        # wavio.write("temp.wav", data, 44100, sampwidth=2)  # 44100은 샘플링 레이트입니다. 필요에 따라 변경하세요.

        # wav 파일로 저장
        wavio.write("temp.wav", data, wav_info["framerate"],
                    sampwidth=wav_info["sampwidth"])  # 원본 WAV 파일의 샘플링 레이트와 샘플 너비를 사용

        try:
            # 저장된 wav 파일을 S3에 업로드
            with open("temp.wav", "rb") as wav_file:
                s3_client.upload_fileobj(wav_file, BUCKET_NAME, file_path)
            os.remove("temp.wav")  # 임시 파일 삭제
            return jsonify({'msg': f"s3://{BUCKET_NAME}/{file_path}"}), 201
        except Exception as e:
            print(str(e))
            return jsonify(error='Failed to upload file'), 500
    else:
        return jsonify(error='Allowed file types are txt, pdf, png, jpg, jpeg, gif, mp4, wav'), 400


@app.route('/api/v1/createAvatarID', methods=['POST'])
def upload_avatar():
    # Avatar로 사용할 사진 업로드
    x_api_key = os.getenv("x-api-key")
    if 'file' not in request.files:
        return jsonify(error='No file part'), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(error='No selected file'), 400
    # files = {'file': (file.filename, file, 'image/jpeg')}

    resp = requests.post(
        "https://upload.heygen.com/v1/talking_photo",
        data=file.read(),  # 파일의 내용을 읽어서 줘야함
        headers={"Content-Type": "image/jpeg", "x-api-key": x_api_key}
    )
    result = resp.json()['data']['talking_photo_id']
    return result


@app.route('/api/v1/videosource', methods=['GET'])
def videoSource():
    voice_name = request.json.get('modelName')
    x_api_key = os.getenv("x-api-key")
    hey_headers = {
        "accept": "application/json",
        "x-api-key": x_api_key
    }

    # talking photo ID 전체조회
    url_avatar = "https://api.heygen.com/v1/talking_photo.list"
    avatar_list = requests.get(url_avatar, headers=hey_headers)

    # voice ID 전체조회
    url_voice = "https://api.heygen.com/v1/voice.list"
    voice_list = requests.get(url_voice, headers=hey_headers)
    voice_json = json.loads(voice_list.text)

    # voice name으로 voice ID 조회

    voice_id = 'none'
    print(voice_name)
    voice_data = voice_json.get('data')
    for voice in voice_data['list']:
        if voice["display_name"] == voice_name:
            voice_id = voice["voice_id"]
            break

    return jsonify({"voice_id": voice_id})


def videoMaker():
    text = request.json.get('answer')
    x_api_key = os.getenv("x-api-key")
    voice_id = request.json.get('voiceId')
    talking_photo_id = request.json.get('avatarId')

    # voice ID 와 talking photo ID를 선택해 input text로 영상 생성
    url_avatar = "https://api.heygen.com/v1/video.generate"
    payload_avatar = {
        "background": "#ffffff",
        "ratio": "16:9",
        "test": False,
        "version": "v1alpha",
        "clips": [
            {
                "avatar_style": "normal",
                "caption": False,
                "input_text": text,
                "scale": 1,
                "voice_id": voice_id,
                "talking_photo_style": "normal",
                "talking_photo_id": talking_photo_id
            }
        ]
    }
    # talking photo ID를 선택해 기본 영상(Silent Video) 생성
    url_silent = "https://api.heygen.com/v2/video/generate"
    payload_silent = {
        "test": False,
        "caption": False,
        "dimension": {
            "width": 1920,
            "height": 1080
        },
        "video_inputs": [
            {
                "character": {
                    "type": "talking_photo",
                    "talking_photo_id": talking_photo_id
                },
                "voice": {
                    "type": "audio",
                    "audio_url": "https://resource.heygen.com/silent.mp3"
                }
            }
        ]
    }

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "x-api-key": x_api_key
    }

    response_avatar = requests.post(url_avatar, json=payload_avatar, headers=headers)
    response_silent = requests.post(url_silent, json=payload_silent, headers=headers)

    return jsonify({"pro_video": response_avatar.text, "common_video": response_silent.text})


def make_tts(ele_voice_id, text, user_no, model_no, conversation_no):
    stability, similarity_boost = 0.5, 0.75
    # voice_id = request.json.get('voiceId')
    # text = request.json.get('answer')
    tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{ele_voice_id}/stream"

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }

    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": stability,
            "similarity_boost": similarity_boost
        }
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
    existing_files = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=folder_key)
    existing_file_keys = [obj['Key'] for obj in existing_files.get('Contents', []) if obj['Key'].endswith('.mp3')]

    # 새 파일 이름 생성
    existing_indices = [int(key.split('/')[-1].split('.')[0]) for key in existing_file_keys if
                        key.split('/')[-1].split('.')[0].isdigit()]
    next_index = 1 if not existing_indices else max(existing_indices) + 1
    output_file = f"{next_index}.mp3"
    output_path = os.path.join(output_folder, output_file)

    with open(output_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)

    file_path = os.path.join(folder_key, output_file)

    try:
        # 파일을 S3에 업로드
        with open(output_path, 'rb') as file:
            s3_client.upload_fileobj(file, BUCKET_NAME, file_path)
        file_url = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': BUCKET_NAME, 'Key': file_path},
                                                    ExpiresIn=3600)
        return jsonify({"voicePath": file_url})
    except Exception as e:
        print(str(e))
        return jsonify({'error': 'Failed to upload file'}), 500


def gpt_answer(model_name, conversation_text, input_text):
    first_setting = """
    너는 {0} 인척 나랑 대화를 해야해. {0}은 죽었어.
    평소 {0}와 나의 대화가 있어.
    """.format(model_name)

    last_setting = """
    여기까지가 평소 나와 {0}의 대화야, 무조건 반말로,
    이 대화에서 {0}의 말투를 따라해서, 내 말에 {0}처럼 대답해줘
    """.format(model_name)

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"},
        json={
            "model": "gpt-3.5-turbo",
            "messages": [
                # system = 사용자가 입력하는 인물, 성격, 특징
                {
                    "role": "system",
                    "content": first_setting + conversation_text + last_setting
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
    print(chat_response)

    return jsonify({"msg": chat_response})


@app.route('/api/v1/stt', methods=["POST"])
def get_audio():
    job_url = request.json.get('wavPath')
    print(job_url)
    transcribe = boto3.client('transcribe', region_name=REGION_NAME)

    # transcribe = boto3.client('transcribe')
    transcription_job_name = str(uuid.uuid4())
    transcribe.start_transcription_job(
        TranscriptionJobName=transcription_job_name,
        Media={'MediaFileUri': job_url},
        MediaFormat='wav',
        LanguageCode='ko-KR'
    )

    while True:
        status = transcribe.get_transcription_job(TranscriptionJobName=transcription_job_name)
        if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            break
        print('Not yet')
        time.sleep(1)
    uri = status['TranscriptionJob']['Transcript']['TranscriptFileUri']

    print('url: ', uri)

    # URI에서 JSON 데이터 가져오기
    response = requests.get(uri)
    data = response.json()
    print('data : ', data)
    result = data["results"]["transcripts"][0]["transcript"]
    print(result)
    return jsonify({"msg": result})


@app.route('/api/v1/upload/files', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify(error='No file part'), 400

    files = request.files.getlist('files')
    userNo = request.form.get('userNo')
    modelNo = request.form.get('modelNo')
    fileType = request.form.get('type')
    responses = []
    for file in files:
        if file.filename == '':
            responses.append('no filename')
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
                    target_path = 'tmp' + target_path
                    ffmpeg.input(source_path).output(target_path, vcodec='libx264', acodec='aac').run(
                        overwrite_output=True)

            if fileType == 'audio':
                new_path = f'{file.filename.split(".")[0]}' + ".mp3"
                convert_audio_to_mp3(temp_blob_path, new_path)
            elif fileType == 'video':
                new_path = f'{file.filename.split(".")[0]}.mp4'
                convert_video_to_mp4(temp_blob_path, new_path)
            else:
                new_path = file.filename
            try:
                # 저장된 pcm 파일을 S3에 업로드
                with open(new_path, "rb") as file:
                    s3_client.upload_fileobj(file, BUCKET_NAME, folder_key + new_path)
                os.remove(new_path)  # 임시 파일 삭제
                s3_url = f'https://remeet.s3.ap-northeast-2.amazonaws.com/{folder_key + new_path}'
                responses.append(s3_url)
            except Exception as e:
                responses.append('Failed to upload file')

            # 각 파일 처리에 대한 응답을 저장
        else:
            responses.append('Invalid file type')
    return jsonify({"fileList": responses})

@app.route('/api/v1/transcribe', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # 파일을 임시 디렉토리에 저장
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_blob_path = os.path.join(temp_dir, "temp_blob_data.webm")
            file.save(temp_blob_path)

            temp_wav_path = os.path.join(temp_dir, "temp_info_check.wav")

            # 오디오 변환
            audio = AudioSegment.from_file(temp_blob_path)
            audio.set_frame_rate(16000).set_channels(1).set_sample_width(2).export(temp_wav_path, format="wav", codec="pcm_s16le")

            # 인식기 초기화
            r = sr.Recognizer()

            with sr.AudioFile(temp_wav_path) as source:
                audio_data = r.record(source)
                try:
                    text = r.recognize_google(audio_data, language='ko-KR')
                    print(text)
                    return jsonify({'transcription': text}), 200
                except sr.UnknownValueError:
                    return jsonify({'error': 'Speech Recognition could not understand the audio'}), 422
                except sr.RequestError as e:
                    return jsonify({'error': f'Could not request results from the Speech Recognition service; {e}'}), 503
            # 임시 파일은 이 블록을 벗어나면 자동으로 삭제됩니다.
    return jsonify({'error': 'Invalid file'}), 400


def make_voice(model_name, gender, audio_files):
    make_voice_url = "https://api.elevenlabs.io/v1/voices/add"

    headers = {
        "Accept": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }

    data = {
        'name': model_name,
        'labels': f'{{"gender": "{gender}"}}',
        'description': f'{model_name} Voice TestModel'
    }

    response = requests.post(make_voice_url, headers=headers, data=data, files=audio_files)
    response.raise_for_status()

    json_response = response.json()

    if "voice_id" not in json_response:
        raise ValueError("Error: 보이스 id를 반환하지 못함.")

    return json_response["voice_id"]


@app.route('api/v1/conversation/makevoice', methods=['POST'])
def make_voice_model():
    model_name = request.json.get('modelName')
    gender_label = request.json.get('gender')
    audio_files = request.files.getlist('files')

    files = [('files', (file.filename, file.read(), 'audio/mpeg')) for file in audio_files]

    try:
        voice_id = make_voice(model_name, gender_label, files)
        return jsonify({'voice_id': voice_id})
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500


@app.route('/api/v1/conversation/video', methods=['POST'])
def make_conversation_video():
    input_text = request.json.get('question')
    model_name = request.get_json("modelName")
    conversation_text = request.get_json("conversationText")
    answer = gpt_answer(model_name, conversation_text, input_text)
    makeVideo = videoMaker(answer, )

    return makeVideo


@app.route('/api/v1/conversation/voice', methods=['POST'])
def make_conversation_voice():
    try:
        input_text = request.json.get('question')
        model_name = request.get_json("modelName")
        conversation_text = request.get_json("conversationText")
        answer = gpt_answer(model_name, conversation_text, input_text)
        ele_voice_id = request.json.get('eleVoiceId')
        user_no = request.json.get('userNo')
        model_no = request.json.get('modelNo')
        conversation_no = request.json.get('conversationNo')
        voice_url = make_tts(ele_voice_id, answer, user_no, model_no, conversation_no)
        # 성공 응답을 JSON으로 포맷 후 반환
        return jsonify({'voiceURL' : voice_url}),200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
