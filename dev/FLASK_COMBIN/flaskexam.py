import os
import boto3
from moviepy.editor import VideoFileClip, concatenate_videoclips, AudioFileClip, concatenate_audioclips
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import tempfile
load_dotenv()
app = Flask(__name__)
CORS(app)

# 환경 변수에서 AWS 자격 증명을 로드합니다.
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
common_url = 'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/'

@app.route('/api/v1/combinResult', methods=['POST'])
def combin_result():
    app.logger.info("11")
    # 다운로드할 영상 파일 목록
    userNo = request.json.get("userNo")
    modelNo = request.json.get("modelNo")
    conversationNo = request.json.get("conversationNo")
    type = request.json.get("type")
    folder_key = f"ASSET/{userNo}/{modelNo}/{conversationNo}/"
    response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=folder_key)

    if response['KeyCount'] > 0:
        files = [item['Key'] for item in sorted(response['Contents'], key=lambda x: x['LastModified'], reverse=False)]
    else:
        return jsonify({"error": "No videos found"}), 404
    print(files)
    # 로컬 시스템에 저장할 파일의 경로와 이름
    local_paths = []
    with tempfile.TemporaryDirectory() as temp_dir:

        for i in range(1, len(files)):
            local_filename = files[i].split('/')[-1]
            local_file_path = os.path.join(temp_dir, local_filename)
            local_paths.append(local_file_path)
            s3_client.download_file(bucket_name, files[i], local_file_path)

        if type == 'video':
            merged_file_path = os.path.join(temp_dir, "merged_video.mp4")
            video_clips = [VideoFileClip(path) for path in local_paths]
            final_clip = concatenate_videoclips(video_clips)
            final_clip.write_videofile(merged_file_path)
            new_path = folder_key + "merged_video.mp4"
        
        elif type == 'voice' :
            merged_file_path = os.path.join(temp_dir, "merged_audio.mp3")
            audio_clips = [AudioFileClip(path) for path in local_paths]
            final_clip = concatenate_audioclips(audio_clips)
            final_clip.write_audiofile(merged_file_path)
            new_path = folder_key + "merged_audio.mp3"
        
        try:
            # 병합된 파일을 S3에 업로드
            with open(merged_file_path, "rb") as file:
                s3_client.upload_fileobj(file, bucket_name, new_path)
            os.remove(merged_file_path)  # 임시 파일 삭제
            s3_url = f"{common_url}{new_path}"
            return jsonify({'result': s3_url}), 200
        except Exception as e:
            error_message = str(e)
            app.logger.info("API Response result : ", 405, "-", error_message)
            return jsonify({'error': error_message}), 405

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
