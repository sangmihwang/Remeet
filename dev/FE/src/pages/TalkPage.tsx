import styled from 'styled-components';
import { useRef } from 'react';
import PageHeader from '@/components/navbar/PageHeader';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import { SmallButton } from '@/components/common';
// import AudioRecorder from '@/components/talk/AudioRecorder';
import AudioStreamer from '@/components/talk/AudioStreamer';
import Video from '@/components/talk/Video';

const TitleWrapper = styled.div`
  width: 100%;
  height: 25rem;
  background-color: var(--primary-color);
`;

const VideoWrapper = styled.div`
  margin: 0 auto;
  width: 86vw;
  height: 12.5rem;
  background-color: #fff;
`;

const ContentWrpper = styled.div`
  width: 100%;
`;

const TalkPage = () => {
  const headerContent = {
    left: '',
    title: '할머니',
    right: '',
  };

  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: 'https://files.movio.la/aws_pacific/avatar_tmp/6674ca1e4ec641f89df53733c121c082/9a02021389f74be8b365120c6ce083c9.mp4?Expires=1698907675&Signature=KXcrHsXUvcINsUfC4Mk9johMYZJs7Pg0x2YoC2WFJXGGpVqRzZghP-x8X6Ss7dazKfxWoSfejWqHfawt897O~K6bNQXdt20N8jSpnIxURIs1jctdh9cNilW0W6xdHAFV95Xz0opZPPb5c3GBi3hvIpkrnBhdxVKJNAtWAS2BbHEW706s~BfJcFBBFmECcR~axMX~zxutSLhBiakID-g9twF0~M5YytVXA7~YHk4fD2BnQpM0tmEX~i5ur498oGIYwGvoBESDKb2zUrB-99oPnrlx1MDXrdTFltHcEo0QK6e12QcF34vlw5j~r2redzlW-1P0gu8ddFwuHiXEEKHbzw__&Key-Pair-Id=K49TZTO9GZI6K',
        type: 'video/mp4',
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <div>
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
        <VideoWrapper>
          <Video options={videoJsOptions} onReady={handlePlayerReady} />
        </VideoWrapper>
      </TitleWrapper>
      <ContentWrpper>
        {/* <AudioRecorder /> */}
        <SmallButton type={1} text="대화 내역" />
        <SmallButton type={2} text="대화 종료" />
        <AudioStreamer />
      </ContentWrpper>
      <BottomNavigation />
    </div>
  );
};

export default TalkPage;
