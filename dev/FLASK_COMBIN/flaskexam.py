import os
import boto3
from moviepy.editor import VideoFileClip, concatenate_videoclips
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# .env 파일에서 환경 변수를 로드합니다.
CORS(app)

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
REGION_NAME = 'ap-northeast-2'

s3_client = boto3.client(
    's3',
    region_name=REGION_NAME,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

bucket_name = 'remeet'

@app.route('api/v1/combinResult', methods=['POST'])
def combin_result():
    # 다운로드할 영상 파일 목록
    videos_to_download = ['download/result_voice.mp4', 'download/result_voice.mp4']

    # 로컬 시스템에 저장할 파일의 경로와 이름
    local_video_paths = []

    for video_key in videos_to_download:
        local_filename = video_key.split('/')[-1]
        local_file_path = os.path.join(os.getcwd(), local_filename)
        local_video_paths.append(local_file_path)
        s3_client.download_file(bucket_name, video_key, local_file_path)
        print(f'{local_filename} has been downloaded.')

    # 영상 병합
    clip1 = VideoFileClip(local_video_paths[0])
    clip2 = VideoFileClip(local_video_paths[1])

    # 두 클립의 프레임 레이트를 동일하게 설정
    fps = max(clip1.fps, clip2.fps)
    clip1 = clip1.set_fps(fps)
    clip2 = clip2.set_fps(fps)

    final_clip = concatenate_videoclips([clip1, clip2])
    final_clip.write_videofile("merged_video.mp4", fps=fps)

    print("Video Merging Complete")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)