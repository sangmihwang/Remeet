from __future__ import print_function
import speech_recognition as sr
from flask import Flask, jsonify, request
from pydub import AudioSegment
import requests
import time
import boto3
import uuid
import wave
import os
from dotenv import load_dotenv
from pydub import AudioSegment
from flask import jsonify, request
from werkzeug.utils import secure_filename
import ffmpeg

app = Flask(__name__)
# .env 파일에서 환경 변수를 로드합니다.
load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
REGION_NAME = 'ap-northeast-2'
BUCKET_NAME = 'remeet'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'wav', 'mp3'}

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


@app.route('/api/v1/videomaker', methods=['POST'])
def videoMaker():
    text = request.json.get('answer')
    x_api_key = os.getenv("x-api-key")

    url = "https://api.heygen.com/v1/video.generate"

    payload = {
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
                # 민웅 voice_id (from ElevenLabs)
                "voice_id": "a4bad3084bef43baa412175abf2b6a8f",
                "talking_photo_style": "normal",
                # 승우 talking_photo_id
                "talking_photo_id": "c57fccf65fdd43eb8d4e9b7939179109"
            }
        ]
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "x-api-key": x_api_key
    }

    response = requests.post(url, json=payload, headers=headers)

    return jsonify({"msg": response.text})


@app.route('/api/v1/tts', methods=['POST'])
def tts():
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

    # voice_id 가져오기
    # voice_id_path = os.path.join("myvoice", "minwoong.txt")
    # with open(voice_id_path, "r") as file:
    #     voice_id = file.read().strip()

    # 설정 가져오기
    # with open("settings.txt", "r") as file:
    stability, similarity_boost = 0.5, 0.75
    voice_id = request.json.get('voiceId')
    text = request.json.get('answer')
    tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream"

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }

    data = {
        # "text": "어떻게 얘기해야 평소 말투를 녹음할 수 있을지 감이 잘 안와요. 뉴스 스크립트 기사를 읽는게 아니라 병국님 상미님한테 말하는것처럼 자연스러운 말투를 녹음하고싶은데, 그게 좀 어려운데요?",
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

    output_folder = os.path.join("samples", voice_id)
    os.makedirs(output_folder, exist_ok=True)
    OUTPUT_PATH = os.path.join(output_folder, "test_minwoong.mp3")

    with open(OUTPUT_PATH, 'wb') as f:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)
    # 로컬 경로 받기
    local_path = OUTPUT_PATH

    if not local_path:
        return jsonify({'error': 'No path provided'}), 400

    # S3에 파일 업로드
    filename = local_path.split('/')[-1]  # 경로에서 파일 이름 추출

    folder_key = f"ASSET/seungwoo/minwoong/"

    # S3 버킷에서 기존 파일 목록 가져오기
    existing_files = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=folder_key)
    existing_file_keys = [obj['Key'] for obj in existing_files.get('Contents', []) if obj['Key'].endswith('.mp3')]

    # 새 파일 이름 생성
    existing_indices = [int(key.split('/')[-1].split('.')[0]) for key in existing_file_keys if
                        key.split('/')[-1].split('.')[0].isdigit()]
    next_index = 1 if not existing_indices else max(existing_indices) + 1
    new_filename = f"{next_index}.mp3"
    file_path = os.path.join(folder_key, new_filename)

    try:
        # 파일을 S3에 업로드
        with open(local_path, 'rb') as file:
            s3_client.upload_fileobj(file, BUCKET_NAME, file_path)
        # s3_client.upload_fileobj(file, BUCKET_NAME, file_path)
        file_url = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': BUCKET_NAME, 'Key': file_path},
                                                    ExpiresIn=3600)
        return jsonify({"msg": file_url})
    except Exception as e:
        print(str(e))
        return jsonify(msg='Failed to upload file'), 500
    # 지정된 경로에 따라 output.mp3 저장
    # file_name_without_ext = os.path.splitext(os.path.basename(voice_id_path))[0]

    # print(f"Audio saved to {OUTPUT_PATH}")
    # return jsonify({"msg": OUTPUT_PATH})


@app.route('/api/v1/gpt', methods=['POST'])
def answer():
    # 파읽 읽어오는 코드
    # file = open("sample.txt", "r", encoding="utf-8")
    # data = file.read()
    # print(data)
    # file.close()

    first_setting = """
    난 이제 엄마랑 대화를 할 예정이야. 우리 엄마는 돌아가셨어
    평소 엄마와 나의 대화를 보고 넌 나의 엄마가 되어 내 말에 답변을 해주면 돼
    일단 평소 나와 엄마의 대화야
    """

    practice = """
    나: 엄마, 주말에 친구들이랑 여행 가려고 하는데 돈 좀 빌려줄 수 있어?
    엄마:  또 돈이 필요하구나? 얼마나 필요해?
    나: 10만 원만 빌려줘. 꼭 다음 주에 갚을게.
    엄마: 그래, 꼭 갚아야 해. 엄마한테 빌리는 돈도 돈이니까. 알겠지?
    나: 알아, 엄마. 고마워.
    엄마:  엄마한테는 굳이 감사하진 않아도 돼. 그런데 주말에 어디로 가려고 해?
    나: 부산에 가려고 해. 바다도 보고 해운대도 가볼까 해.
    엄마: 아, 부산 좋지. 바다도 넓고 공기도 좋아. 근데 안전하게 다녀와야 해. 알겠지?
    나: 네, 걱정하지 마. 다들 조심히 다닐게.
    엄마: 그래. 내 딸이 이렇게 커서 친구들이랑 여행도 가네. 시간 참 빠르다.
    나: 엄마도 가끔은 나가서 쉬면 좋을 것 같아.
    엄마:  엄마는 집에서도 잘 쉰다니까. 그냥 너희들이 건강하고 행복하면 그게 제일이야.
    나: 그래도 엄마, 가끔은 외출해서 좋은 곳에 가서 휴식을 취하는 것도 필요하다고 생각해.
    엄마: 아이고, 내 딸아. 너희들이 잘 지내고 행복하면 그게 엄마한테는 최고의 휴식이야. 그래도 말하긴, 요즘 좀 몸이 피곤하긴 해.
    나: 그럼 주말에 스파나 마사지샵에 가서 푹 쉬면 어때?
    엄마: 그런 곳은 처음 가봐서 좀 민망하긴 한데... 생각해볼게.
    나: 엄마, 그런 거에 대해 너무 걱정하지 마. 오히려 좋은 경험이 될 거야.
    엄마: 아이고, 너희들이 이렇게 걱정해주니 감사하다. 그래, 한번 시도해볼게.
    나: 그래! 엄마가 편안하게 쉬는 모습을 보고 싶어.
    엄마: 아, 고마워. 엄마도 너희들이 건강하고 행복하게 지내는 모습을 보면 가장 행복해.
    """

    last_setting = """
    여기까지가 평소 나와 엄마의 대화야
    이 대화에서 엄마 말투만 참고하고 다음 나오는 나의 말에 대한 대답을 한 문장으로 생성해줘 
    """
    input_text = request.json.get('question')
    final_conversations = first_setting + practice + last_setting
    practice += "나 :" + input_text + "\n"

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"},
        json={
            "model": "gpt-3.5-turbo",
            "messages": [
                # system = 사용자가 입력하는 인물, 성격, 특징
                {
                    "role": "system",
                    "content": "너는 나의 엄마야. 나의 말에 엄마처럼 대답만 하면 돼",
                },
                # assistant = 이전대화 기록함
                {"role": "assistant", "content": final_conversations},
                # user = 내가 보내는 message
                {"role": "user", "content": input_text},
            ],
        },
    )
    chat_response = (
        response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
    )
    if "엄마:" in chat_response:
        chat_response = chat_response.split(":")[-1]
    print(chat_response)
    practice += "엄마 :" + chat_response + "\n"

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


@app.route('/api/v1/start_stt', methods=['POST'])
def post_audio():
    # Record Audio
    r = sr.Recognizer()
    audio_file = request.files.get('audio')
    print(audio_file)
    if audio_file is None:
        return "No audio file provided", 400  # Return 400 Bad Request

    audio_file.seek(0)

    with sr.AudioFile(audio_file) as source:
        audio = r.record(source)
    print(audio)
    # Speech recognition using Google Speech Recognition
    try:
        # for testing purposes, we're just using the default API key
        # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
        # instead of `r.recognize_google(audio)`
        result = r.recognize_google(audio)
        print("You said: " + result)
        return jsonify({"transcription": result})
    except sr.UnknownValueError:
        result = "Google Speech Recognition could not understand audio"
        print("You said: " + result)
        return jsonify({"transcription": result})
    except sr.RequestError as e:
        result = "Could not request results from Google Speech Recognition service"
        print("You said: " + result)
        return jsonify({"transcription": result})


@app.route('/api/v1/upload/audio', methods=['POST'])
def upload_audio():
    if 'files' not in request.files:
        return jsonify(error='No file part'), 400

    files = request.files.getlist('files')
    userNo = request.form.get('userNo')
    modelNo = request.form.get('modelNo')
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


            # 파일 처리 로직...
            new_path = f'{file.filename.split(".")[0]}'+".mp3"
            convert_audio_to_mp3(temp_blob_path, new_path)
            # S3 업로드 등의 추가 처리...
            try:
                # 저장된 pcm 파일을 S3에 업로드
                with open(new_path, "rb") as audio_file:
                    s3_client.upload_fileobj(audio_file, BUCKET_NAME, folder_key + new_path)
                os.remove(new_path)  # 임시 파일 삭제
                s3_url = f'https://remeet.s3.ap-northeast-2.amazonaws.com/{folder_key + new_path}'
                responses.append(s3_url)
            except Exception as e:
                responses.append('Failed to upload file')

            # 각 파일 처리에 대한 응답을 저장
        else:
            responses.append('Invalid file type')
    return jsonify({"audioList": responses})

@app.route('/api/v1/upload/video', methods=['POST'])
def upload_video():
    if 'files' not in request.files:
        return jsonify(error='No file part'), 400

    files = request.files.getlist('files')
    userNo = request.form.get('userNo')
    modelNo = request.form.get('modelNo')
    responses = []
    
    for file in files:
        if file.filename == '':
            responses.append('no filename')
            continue
        video_ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'flv', 'wmv'}

        def allowed_video(filename):
            return '.' in filename and \
                filename.rsplit('.', 1)[1].lower() in video_ALLOWED_EXTENSIONS
        if file and allowed_video(file.filename):
            folder_key = f"ASSET/{userNo}/{modelNo}/"
            temp_blob_path = secure_filename(file.filename)  # 안전한 파일 이름 사용
            file.save(temp_blob_path)

            def convert_video_to_mp4(source_path, target_path):
                if source_path == target_path:
                    target_path = 'tmp'+target_path
                    ffmpeg.input(source_path).output(target_path, vcodec='libx264', acodec='aac').run(overwrite_output=True)

            
            # 파일 처리 로직...
            new_path = f'{file.filename.split(".")[0]}.mp4'
            convert_video_to_mp4(temp_blob_path, new_path)
            
            # S3 업로드 등의 추가 처리...
            try:
                # 저장된 mp4 파일을 S3에 업로드
                with open(new_path, "rb") as video_file:
                    s3_client.upload_fileobj(video_file, BUCKET_NAME, folder_key + new_path)
                os.remove(new_path)  # 임시 파일 삭제
                s3_url = f'https://{BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/{folder_key + new_path}'
                responses.append(s3_url)
            except Exception as e:
                responses.append(f'Failed to upload file: {e}')

            # 각 파일 처리에 대한 응답을 저장
        else:
            responses.append('Invalid file type')

    return jsonify({"videoList": responses})

if __name__ == '__main__':
    app.run(port=5000, debug=True)