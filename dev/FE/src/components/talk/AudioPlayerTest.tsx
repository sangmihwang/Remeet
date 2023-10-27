import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
// import 'react-h5-audio-player/lib/styles.less' Use LESS
// import 'react-h5-audio-player/src/styles.scss' Use SASS

const AudioPlayerTest = ({ src }: { src: string }) => (
  <AudioPlayer
    autoPlay
    src={src}
    onPlay={() => console.log('onPlay')}
    // other props here
  />
);

export default AudioPlayerTest;
