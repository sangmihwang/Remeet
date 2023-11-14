import os
from google.oauth2 import service_account
from google.cloud import speech
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
from pydub import AudioSegment
# 환경 변수에서 API 키 경로를 가져옵니다.
load_dotenv()
key_path = 'C:/Users/SSAFY/Desktop/자율/dev/FLASK/google.json'

app = Flask(__name__)
CORS(app)

@app.route('/transcribe', methods=['POST'])
def transcribe_file():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400
    if file:
        # 파일을 임시 디렉토리에 저장
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_blob_path = os.path.join(temp_dir, "temp_blob_data.webm")
            file.save(temp_blob_path)

            # .wav 파일로 변환
            temp_wav_path = os.path.join(temp_dir, "temp_info_check.wav")
            audio = AudioSegment.from_file(temp_blob_path)
            audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
            audio.export(temp_wav_path, format="wav", codec="pcm_s16le")

            # 변환된 .wav 파일을 읽어오기
            with open(temp_wav_path, "rb") as audio_file:
                audio_content = audio_file.read()

            # 오디오 파일을 텍스트로 변환
            credentials = service_account.Credentials.from_service_account_file(key_path)
            client = speech.SpeechClient(credentials=credentials)

            audio = speech.RecognitionAudio(content=audio_content)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code='ko-KR'
            )

            response = client.recognize(config=config, audio=audio)

            # 변환된 텍스트를 수집
            transcripts = [result.alternatives[0].transcript for result in response.results]
            print(transcripts)
            return jsonify(transcripts)

if __name__ == '__main__':
    app.run(debug=True)