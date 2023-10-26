from __future__ import print_function
import speech_recognition as sr
from flask import Flask, jsonify, request
import requests
import time
import boto3
import uuid
import sys
import os
from dotenv import load_dotenv
app = Flask(__name__)
# .env 파일에서 환경 변수를 로드합니다.
load_dotenv()

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

    print(response.text)


@app.route('/api/v1/tts', methods=['POST'])
def tts():
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

    

    # voice_id 가져오기
    # voice_id_path = os.path.join("myvoice", "minwoong.txt")
    # with open(voice_id_path, "r") as file:
    #     voice_id = file.read().strip()

    # 설정 가져오기
    with open("settings.txt", "r") as file:
        stability, similarity_boost = map(float, file.read().split(','))
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

    # 지정된 경로에 따라 output.mp3 저장
    # file_name_without_ext = os.path.splitext(os.path.basename(voice_id_path))[0]
    output_folder = os.path.join("samples", voice_id)
    os.makedirs(output_folder, exist_ok=True)
    OUTPUT_PATH = os.path.join(output_folder, "test_minwoong.mp3")

    with open(OUTPUT_PATH, 'wb') as f:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)

    print(f"Audio saved to {OUTPUT_PATH}")
    return jsonify({"msg": OUTPUT_PATH})



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
        chat_response = chat_response.split("엄마:")[-1]
    print(chat_response)
    practice += "엄마 :" + chat_response + "\n"
    
    return jsonify({"msg": chat_response})


@app.route('/api/v1/stt', methods=["POST"])
def get_audio():
    job_url = request.json.get('wavPath')
    print(job_url)
    transcribe = boto3.client('transcribe')
    transcription_job_name = str(uuid.uuid4())
    transcribe.start_transcription_job(
        TranscriptionJobName=transcription_job_name,
        Media = {'MediaFileUri': job_url},
        MediaFormat = 'wav',
        LanguageCode = 'ko-KR'
    )

    while True:
        status = transcribe.get_transcription_job(TranscriptionJobName=transcription_job_name)
        if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED','FAILED']:
            break
        print('Not yet')
        time.sleep(1)
    uri = status['TranscriptionJob']['Transcript']['TranscriptFileUri']

    # URI에서 JSON 데이터 가져오기
    response = requests.get(uri)
    data = response.json()
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
        result ="Google Speech Recognition could not understand audio"
        print("You said: " + result)
        return jsonify({"transcription": result})
    except sr.RequestError as e:
        result ="Could not request results from Google Speech Recognition service"
        print("You said: " + result)
        return jsonify({"transcription": result})
   
    
if __name__ == '__main__':
    app.run(debug=True)