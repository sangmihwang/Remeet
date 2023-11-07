import speech_recognition as sr
from flask import Flask, request, jsonify
import os
from pydub import AudioSegment
import tempfile
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/transcribe', methods=['POST'])
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

if __name__ == '__main__':
    app.run(debug=True)
