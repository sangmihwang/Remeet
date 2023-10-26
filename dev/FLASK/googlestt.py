import speech_recognition as sr
from flask_socketio import SocketIO, emit
from flask import Flask, jsonify
import json
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

UPLOAD_FOLDER = 'DEV'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    
@socketio.on('stream_audio')
def handle_audio(data):
# Record Audio
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Say something!")
        audio = r.listen(source)
    # Speech recognition using Google Speech Recognition
    try:
        filepath = os.path.join(UPLOAD_FOLDER, "audio.wav")
        with open(filepath, 'wb') as f:
            f.write(audio)
        # for testing purposes, we're just using the default API key
        # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
        # instead of `r.recognize_google(audio)`
        print("You said: " + r.recognize_google(audio))
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))


if __name__ == '__main__':
    socketio.run(app, debug=True)