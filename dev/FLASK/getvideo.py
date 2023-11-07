import requests

# voice ID 와 talking photo ID를 선택해 input text로 영상 생성
url_avatar = "https://api.heygen.com/v1/video.generate"

# talking photo ID를 선택해 기본 영상(Silent Video) 생성
url_silent = "https://api.heygen.com/v2/video/generate"

headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "x-api-key":  os.getenv('x-api-key')
}

payload_avatar = {
    "background": "#ffffff",
    "ratio": "16:9",
    "test": False,
    "version": "v1alpha",
    "clips": [
        {
            "avatar_style": "normal",
            "caption": False,
            "input_text": "Welcome to movio API는 영어였고요 이제 한국말로 해보겠습니다. 안녕하세요 티맥스 다음주에 작성해야합니다 테스트테스트. 다시 English Time, oksy? elevenlabs and heygen nice.",
            "scale": 1,
            # 민웅 voice_id (from ElevenLabs)
            "voice_id": "a4bad3084bef43baa412175abf2b6a8f",
            "talking_photo_style": "normal",
            # 승우 talking_photo_id
            "talking_photo_id": "c57fccf65fdd43eb8d4e9b7939179109"
        }
    ]
}

# response_avatar = requests.post(url_avatar, json=payload_avatar, headers=headers)

# print(response_avatar.text)

payload_silent  = {
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
                # 승우 talking_photo_id
                "talking_photo_id": "c57fccf65fdd43eb8d4e9b7939179109"
            }, 
            "voice":{
                "type":"audio",
                "audio_url": "https://resource.heygen.com/silent.mp3"
            }
        }
    ]
}

# response_silent = requests.post(url_silent, json=payload_silent, headers=headers)
# print(response_silent.text)