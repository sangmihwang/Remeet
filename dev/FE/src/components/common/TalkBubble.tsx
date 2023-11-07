import styled from 'styled-components';

// const Wrapper = styled.div`
//   background-color: #fff;
//   border: 1px solid #e5e5ea;
//   border-radius: 0.25rem;
//   display: flex;
//   flex-direction: column;
//   font-family: 'SanFrancisco';
//   font-size: 1.25rem;
//   margin: 0 auto 1rem;
//   max-width: 600px;
//   padding: 0.5rem 1.5rem;
// `;

// const BaseButton = styled.div`
//   border-radius: 1.15rem;
//   line-height: 1.25;
//   max-width: 75%;
//   padding: 0.5rem 0.875rem;
//   position: relative;
//   word-wrap: break-word;
//   &::before {
//     bottom: -0.1rem;
//     content: '';
//     height: 1rem;
//     position: absolute;
//   }
//   &::after {
//     bottom: -0.1rem;
//     content: '';
//     height: 1rem;
//     position: absolute;
//   }
// `;

// const ButtonFromMe = styled(BaseButton)`
//   align-self: flex-end;
//   background-color: #248bf5;
//   color: #fff;
//   &::before {
//     border-bottom-left-radius: 0.8rem 0.7rem;
//     border-right: 1rem solid #248bf5;
//     right: -0.35rem;
//     transform: translate(0, -0.1rem);
//   }
//   &::after {
//     background-color: #fff;
//     border-bottom-left-radius: 0.5rem;
//     right: -40px;
//     transform: translate(-30px, -2px);
//     width: 10px;
//   }
// `;

// const ButtonFromThem = styled(BaseButton)`
//   align-items: flex-start;
//   background-color: #e5e5ea;
//   color: #000;
//   &::before {
//     border-bottom-right-radius: 0.8rem 0.7rem;
//     border-left: 1rem solid #e5e5ea;
//     left: -0.35rem;
//     transform: translate(0, -0.1rem);
//   }
//   &::after {
//     background-color: #fff;
//     border-bottom-right-radius: 0.5rem;
//     left: 20px;
//     transform: translate(-30px, -2px);
//     width: 10px;
//   }
// `;

// const Shape = styled.div`
//   margin-bottom: 3rem;
//   width: 200px; /* Adjust as necessary */
//   height: 100px; /* Adjust as necessary */
//   background-color: #007bff; /* Your color */
//   clip-path: polygon(
//     0 0,
//     100% 0,
//     100% calc(100% + 50px),
//     calc(100% + 50px) 100%,
//     0 100%
//   );
// `;

const IMessage = styled.div`
  background-color: #fff;
  border: 1px solid #e5e5ea;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  font-family: 'SanFrancisco';
  font-size: 1.25rem;
  margin: 0 auto 1rem;
  max-width: 600px;
  padding: 0.5rem 1.5rem;
  // 반응형 스타일도 여기 포함시킬 수 있습니다.
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
  }

  // from-them 스타일
  &.from-them {
    align-items: flex-start;
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
  }

  // 기타 클래스 및 스타일...
`;

const TalkBubble = () => {
  return (
    <IMessage>
      <Message className="from-me">
        와 신기하다 왜 기자릴 낮ㄴㅁㅇㄻㄴㅇㄻㄴㄹㄴ
      </Message>
      <Message className="from-me">와 신기하다</Message>
      <Message className="from-them">
        정말 신기하다 여긴 왜 이짊ㄴ앎ㄴ아러ㅣㅏㄴㅇ
      </Message>
      <Message className="from-me">와 신기하다</Message>
      <Message className="from-them">정말 신기하다</Message>
      <Message className="from-them">정말 신기하다</Message>
    </IMessage>
  );
};

export default TalkBubble;
