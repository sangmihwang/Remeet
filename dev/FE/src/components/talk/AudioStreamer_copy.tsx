import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const AudioStreamer: React.FC = () => {
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const socket = io('http://127.0.0.1:5000/');

  let mediaRecorder: MediaRecorder | null = null;
  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
          socket.emit('stream_audio', event.data);
        }
      };

      mediaRecorder.start(1000); // sends data in chunks of 1 second each
    } catch (error) {
      console.error('Error accessing the microphone:', error);
    }
  };
  useEffect(() => {
    socket.on('connect_to_ws', () => {
      console.log('Connected to the server');
      startStreaming();
    });
    // socket.on()

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      socket.disconnect();
    };
  }, []);

  const playAudioFromChunks = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div>
      <h1>Streaming Audio to Server</h1>
      <button onClick={playAudioFromChunks}>Play Audio</button>
    </div>
  );
};

export default AudioStreamer;
