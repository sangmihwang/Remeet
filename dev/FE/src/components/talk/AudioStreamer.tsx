import React, { useEffect } from 'react';
import io from 'socket.io-client';

const AudioStreamer: React.FC = () => {
  let mediaRecorder: MediaRecorder | null = null;
  const socket = io('http://127.0.0.1:5000/');
  const audioChunks = [];

  useEffect(() => {
    const startStreaming = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
            // Send this audio chunk to the server via socket.io
            socket.emit('stream_audio', event.data);
            // console.log('whyhere');
          }
        };

        mediaRecorder.start(1000); // sends data in chunks of 1 second each
      } catch (error) {
        console.error('Error accessing the microphone:', error);
      }
    };

    startStreaming();

    socket.on('connected_to_ws', (data) => {
      console.log(data.message); // "Successfully connected to WebSocket" 출력
    });

    socket.on('transcribe_result', (data) => {
      console.log('Received processed audio data from server:', data);
      // Handle the received data as needed
    });

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      socket.off('transcribe_result');
      socket.disconnect();
    };
  }, []);
  const playAudioFromChunks = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    console.log(audio, '확인');
    audio.play();
  };

  return (
    <div>
      <h1>Streaming Audio to Server</h1>
      <button onClick={playAudioFromChunks}>오디오 듣기</button>
    </div>
  );
};

export default AudioStreamer;

// const AudioStreamer: React.FC = () => {
//   let mediaRecorder: MediaRecorder | null = null;
//   const socket = io('http://127.0.0.1:5000/');
//   const audioChunks = [];

//   useEffect(() => {
//     socket.on('connected_to_ws', (data) => {
//       console.log(data.message);
//     });

//     socket.on('transcribe_result', (data) => {
//       console.log('Received processed audio data from server:', data);
//     });

//     return () => {
//       if (mediaRecorder) {
//         mediaRecorder.stop();
//       }
//       socket.off('transcribe_result');
//       socket.disconnect();
//     };
//   }, []);

//   const startStreaming = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });

//       mediaRecorder = new MediaRecorder(stream);

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunks.push(event.data);
//           socket.emit('stream_audio', event.data);
//         }
//       };

//       mediaRecorder.start(1000);
//     } catch (error) {
//       console.error('Error accessing the microphone:', error);
//     }
//   };

//   const playAudioFromChunks = () => {
//     const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//     const audioUrl = URL.createObjectURL(audioBlob);
//     const audio = new Audio(audioUrl);
//     console.log(audio, '확인');
//     audio.play();
//   };

//   return (
//     <div>
//       <h1>Streaming Audio to Server</h1>
//       <button onClick={startStreaming}>Start Streaming</button>
//       <button onClick={playAudioFromChunks}>Play Audio</button>
//     </div>
//   );
// };

// export default AudioStreamer;
