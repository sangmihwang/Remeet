import React, { useState, useRef } from 'react';

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const audioChunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const newAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      setAudioBlob(newAudioBlob);
      // You can save or send the audioBlob to the server now
    };

    mediaRecorder.start();
    setRecording(true);

    // Stop recording after 6 seconds
    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
    }, 6000);
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        {recording ? 'Recording...' : 'Start Recording'}
      </button>
      {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
    </div>
  );
};

export default AudioRecorder;

// const AudioRecorder: React.FC = () => {
//   const [recording, setRecording] = useState<boolean>(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);

//   const stopRecording = () => {
//     console.log('확인');
//     mediaRecorderRef.current?.stop();
//     setRecording(false);
//   };

//   const processAudioData = (event: BlobEvent) => {
//     const audioData = new Float32Array(event.data.size);
//     const threshold = 0.05; // Placeholder threshold
//     const isVoiceDetected = audioData.some(
//       (sample) => Math.abs(sample) > threshold,
//     );

//     if (isVoiceDetected) {
//       if (!recording) {
//         setRecording(true);
//         setTimeout(stopRecording, 2000); // Max duration
//       }
//       audioChunksRef.current.push(event.data);
//     } else if (recording) {
//       stopRecording();
//     }
//   };

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const mediaRecorder = new MediaRecorder(stream);
//     mediaRecorderRef.current = mediaRecorder;

//     mediaRecorder.ondataavailable = processAudioData;
//     mediaRecorder.onstop = () => {
//       const newAudioBlob = new Blob(audioChunksRef.current, {
//         type: 'audio/wav',
//       });
//       setAudioBlob(newAudioBlob);
//     };

//     mediaRecorder.start(100); // Process audio every 100ms
//   };

//   return (
//     <div>
//       <button onClick={startRecording} disabled={recording}>
//         Start Detection
//       </button>
//       {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
//     </div>
//   );
// };

// export default AudioRecorder;
