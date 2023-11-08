import styled from 'styled-components';

const IMessage = styled.div`
  background-color: #fff;
  border: 1px solid #e5e5ea;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  font-family: 'SanFrancisco';
  font-size: 1rem;
  margin: 0 auto 1rem;
  max-width: 600px;
  padding: 0.5rem 1.5rem;
`;

const Message = styled.p`
  border-radius: 1.15rem;
  line-height: 1.25;
  max-width: 75%;
  padding: 0.5rem 0.875rem;
  position: relative;
  word-wrap: break-word;

  &::before,
  &::after {
    bottom: -0.1rem;
    content: '';
    height: 1rem;
    position: absolute;
  }

  // from-me 스타일
  &.from-me {
    align-self: flex-end;
    background-color: var(--primary-color);
    color: #fff;

    &::before {
      border-bottom-left-radius: 0.8rem 0.7rem;
      border-right: 1rem solid var(--primary-color);
      right: -0.35rem;
      transform: translate(0, -0.1rem);
    }

    &::after {
      background-color: #fff;
      border-bottom-left-radius: 0.5rem;
      right: -40px;
      transform: translate(-30px, -2px);
      width: 10px;
    }
    &:not(:last-child) {
      margin: 0.25rem 0 0;
    }
    &:last-child {
      margin: 0.25rem 0 0;

      margin-bottom: 0.5rem;
    }
  }

  // from-them 스타일
  &.from-them {
    margin-bottom: 0rem;
    margin-left: 0.5rem;
    align-self: flex-start;
    background-color: #e5e5ea;
    color: #000;

    &::before {
      border-bottom-right-radius: 0.8rem 0.7rem;
      border-left: 1rem solid #e5e5ea;
      left: -0.35rem;
      transform: translate(0, -0.1rem);
    }

    &::after {
      background-color: #fff;
      border-bottom-right-radius: 0.5rem;
      left: 20px;
      transform: translate(-30px, -2px);
      width: 10px;
    }
    &:not(:last-child) {
      margin: 0.25rem 0 0 2.5rem;
    }
    &:last-child {
      margin-bottom: 0.5rem;
    }
  }

  &.no-tail {
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
  }
`;
const ProfileImage = styled.p<{ $imagePath: string }>`
  width: 2rem;
  height: 2rem;
  margin: 1rem 0 0 0;
  border-radius: 100%;
  background-image: url(${(props) => props.$imagePath});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
`;

const ImageWrapper = styled.p`
  display: flex;
  margin: 0;
`;

interface TalkBubbleProps {
  conversation: { [key: string]: string }[];
  imagePath: string | undefined;
}

const TalkBubble = ({ conversation, imagePath }: TalkBubbleProps) => {
  const $imagePath = imagePath || '/dummy/갱얼쥐.jpg';
  return (
    <IMessage>
      {conversation?.map((item, idx) => {
        const prevKey =
          idx !== 0 ? Object.keys(conversation[idx - 1])[0] : null;
        const key = Object.keys(item)[0];
        const nextKey =
          idx !== conversation.length - 1
            ? Object.keys(conversation[idx + 1])[0]
            : null;
        const value = item[key];
        const tail = key === nextKey ? 'no-tail' : '';
        const className = (key === '나 ' ? 'from-me ' : 'from-them ') + tail;

        if (key === '나 ') {
          return <Message className={className}>{value}</Message>;
        }

        return prevKey !== key ? (
          <ImageWrapper>
            <ProfileImage $imagePath={$imagePath} />
            <Message className={className}>{value}</Message>
          </ImageWrapper>
        ) : (
          <Message className={className}>{value}</Message>
        );
      })}
    </IMessage>
  );
};

export default TalkBubble;
