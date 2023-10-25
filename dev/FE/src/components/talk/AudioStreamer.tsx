import React, { useEffect } from 'react';
import io from 'socket.io-client';

const AudioStreamer: React.FC = () => {
  let mediaRecorder: MediaRecorder | null = null;
  const socket = io('http://127.0.0.1:5000/');

  useEffect(() => {
    const startStreaming = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            // Send this audio chunk to the server via socket.io
            socket.emit('audioData', event.data);
          }
        };

        mediaRecorder.start(1000); // sends data in chunks of 1 second each
      } catch (error) {
        console.error('Error accessing the microphone:', error);
      }
    };

    startStreaming();

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Streaming Audio to Server</h1>
    </div>
  );
};

export default AudioStreamer;
