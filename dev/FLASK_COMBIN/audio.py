import os
import boto3
from moviepy.editor import AudioFileClip, concatenate_audioclips
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
    # 다운로드할 오디오 파일 목록
    userNo = request.json.get("userNo")
    modelNo = request.json.get("modelNo")
    conversationNo = request.json.get("conversationNo")
    folder_key = f"ASSET/{userNo}/{modelNo}/{conversationNo}/"
    response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=folder_key)

    if response['KeyCount'] > 0:
        videos_to_download = [item['Key'] for item in response['Contents']]
    else:
        return jsonify({"error": "No videos found"}), 404
    print(videos_to_download)

    audio_clips = []
    with tempfile.TemporaryDirectory() as temp_dir:
        for i in range(1, len(videos_to_download)):
            audio_key = videos_to_download[i]
            local_filename = os.path.join(temp_dir, f'{i}.'+videos_to_download[i].split('/')[-1].split('.')[-1])
            print(local_filename)
            s3_client.download_file(bucket_name, audio_key, local_filename)
            audio_clips.append(AudioFileClip(local_filename))


        # 병합된 파일 경로
        merged_file_path = os.path.join(temp_dir, "merged_audio.mp3")
        
        # 오디오 병합
        final_clip = concatenate_audioclips(audio_clips)
        final_clip.write_audiofile(merged_file_path)

        # S3에 업로드할 병합된 파일의 새 경로 생성
        type = 'mp3'  # 병합된 파일 형식
        new_path = folder_key + "merged_audio_" + str(conversationNo) + "." + type

        try:
            # 병합된 파일을 S3에 업로드
            with open(merged_file_path, "rb") as file:
                s3_client.upload_fileobj(file, bucket_name, new_path)
            s3_url = f"{common_url}{new_path}"
            return jsonify({'result': s3_url}), 200
        except Exception as e:
            error_message = str(e)
            app.logger.info("API Response result : ", 405, "-", error_message)
            return jsonify({'error': error_message}), 405

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
