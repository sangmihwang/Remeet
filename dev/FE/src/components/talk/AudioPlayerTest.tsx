import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AudioPlayerTest = ({ src }: { src: string }) => (
  <AudioPlayer
    autoPlay
    src={src}
    onPlay={() => {}}
    // other props here
  />
);

export default AudioPlayerTest;
