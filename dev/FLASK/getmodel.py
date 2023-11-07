import requests
import os

HEADERS = {
    "accept": "application/json",
    "x-api-key": os.getenv('x-api-key')
}

# Avatar 리스트 가져오기
def fetch_avatars():
    url_avatar = "https://api.heygen.com/v1/talking_photo.list"
    avatar_list = requests.get(url_avatar, headers=HEADERS)
    return avatar_list.text

# Voice 리스트 가져오기
def fetch_voices():
    url_voice = "https://api.heygen.com/v1/voice.list"
    voice_list = requests.get(url_voice, headers=HEADERS)
    return voice_list.text

# Avatar로 사용할 사진 업로드
def upload_avatar(image_path):
    with open(image_path, "rb") as f:
        resp = requests.post(
            "https://upload.heygen.com/v1/talking_photo",
            data=f,
            headers={
                "Content-Type": "image/jpeg",
                "x-api-key": os.getenv('x-api-key')
            }
        )
    return resp.json()


# Avatar 출력 형태 
'''
{
  "code": 100,
  "data": [
   ##### 내가 등록한 avatar
    {
      "circle_image": "",
      "id": "c57fccf65fdd43eb8d4e9b7939179109",
      "image_url": "https://files.movio.la/prod/movio/url_upload/user_upload/6674ca1e4ec641f89df53733c121c082/a6bf9e752757450caa15b714442a3989.image/jpeg?Expires=1698902507&Signature=iAHAAZp1QpuGmtlyDG6jzDiao5fpPfBjoTa7uEdTOz1Ai-rvHZzd481C-ioBxqM7EsWGF0TJD~6AJVFclntp1rlnYvjEvuhGF~1CDK4JU~OKSWL1sXdmAJuFi0ithMWjCnlau9mpNBS4S37i0dJm2E5FXsOvLBQUoBbyDoVNbBgg8pfA29wMooOY6qc6G7JngVy7PGuOFN1C4S8t~hSPd3XrteSXkLLMBUJXO-ipavGFqXngaK9eh42cLYrygv73vKtLdGV7GlkSFNtKFz4~KMv09ig40csdmary~QNtK1G2-vGPkrloC7upjuiVKOQHBWvs3CCZzsrHkZ2Yk0J8dA__&Key-Pair-Id=K49TZTO9GZI6K"
    },
   ###### 기존에 등록되어있던 default avatar
    {
      "circle_image": "",
      "id": "ba9c11684315405aac1dd8ed987fdda2",
      "image_url": "https://files.movio.la/prod/movio/url_upload/user_upload/632e0fe43dbf472cabecf45d5780856f/35dcedc4cc4e4d7db61b341e9c2aa271.jpeg?Expires=1698904192&Signature=V4hv6m4J9~WOKxMxAXvmAMR75PnjJk3n3ubyZK-dNIN0KuleS3muB~HyU4Kob~9MBLh-rPwf5oMW2YLSr28EO3h-NgmmWeO09GgkyZub7~YXBx~XOLZBQZkOx~hoyVz7Ln7ojmsTqwJauvtLVNLTuGAdWdB34Bbzpl8TbEbzzT3eHrSoECWfSQVaSMGbHXHMWis~Bp~0EqQ3p1vZxhPIDjhSGsvOuE2u5V5GWGAo3dwWaciSZwWjr0rM0GLUVypAJxBbrQfYqkHsobdcBPKhGZQODc6rDro-jxCPNuc1CvHBpjn5t3kpJdGoFCbOlXez8Ch~LAAAMtdAihWoTiMIHA__&Key-Pair-Id=K49TZTO9GZI6K",
      "is_preset": true,
      "video_url": ""
    },...
  ],
  "message": "Success"
}
'''
# Voice 출력 형태
'''
{
  "code": 100,
  "data": {
    "list": [
    
##### 기존에 등록되어있던 default voice 
      {
        "voice_id": "ffdbe4de35d34391830da243f2b82e13",
        "labels": [
          "Youth",
          "News",
          "E-learning",
          "Explainer"
        ],
        "language": "Chinese",
        "flag": "https://static.movio.la/region_flags/cn.png",
        "locale": "zh-CN",
        "sort": 6,
        "gender": "Male",
        "tags": "Young Adult, News, Audiobooks, E-learning & Presentations, Explainer Videos",
        "display_name": "Yunxi - Friendly",
        "preview": {
          "movio": "https://static.movio.la/voice_preview/db9a5f4a5a1f4cd7a39c5a675e051a51.wav"
        },
        "settings": {
          "style": "assistant",
          "elevenlabs_settings": null
        },
        "ssml": {
          "style": [],
          "lang": [],
          "break": true,
          "prosody": [
            "rate",
            "pitch"
          ],
          "emphasis": "none",
          "say_as": []
        },
        "is_customer": false,
        "is_favorite": false,
        "is_paid": false,
        "support_realtime": true
      },

###### ElevenLabs에서 받아와서 On 처리한 voice
      {
        "voice_id": "720b7163e1dc40ddbe76ab8a58161f7b",
        "labels": [],
        "language": "unknown",
        "flag": "",
        "locale": "unknown",
        "sort": 0,
        "gender": "unknown",
        "tags": "",
        "display_name": "Sangmi",
        "preview": {
          "movio": ""
        },
        "settings": {
          "style": "",
          "elevenlabs_settings": null
        },
        "ssml": {
          "style": [],
          "lang": [],
          "break": false,
          "prosody": [
            "rate"
          ],
          "emphasis": "none",
          "say_as": []
        },
        "is_customer": true,
        "is_favorite": false,
        "is_paid": false,
        "support_realtime": false
      }
    ]
  },
  "msg": null,
  "message": null
}
'''