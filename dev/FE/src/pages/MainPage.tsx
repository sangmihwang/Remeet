import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { keyframes, styled } from 'styled-components';

const Wrapper = styled.div`
  background-color: var(--primary-color);
  height: 100vh;
`;

const Title = styled.div`
  position: absolute;
  top: 15vh;
  left: 10vw;
  color: #fff;
  font-size: 2.5rem;
  font-weight: 700;
  width: fit-content;
  height: fit-content;
`;

const ButtonWrapper = styled.div`
  box-sizing: border-box;
  position: absolute;
  bottom: 20vh;
  width: 100vw;
  padding: 0 10vw;
  display: flex;
  justify-content: space-between;
`;
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const Button = styled.button`
  box-sizing: border-box;
  min-width: 35vw;
  height: 4rem;
  padding: 1rem 2rem;
  border: 0;
  border-radius: 10px;
  background-color: #fff;
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary-color);
  animation: ${fadeInUp} 1.5s ease-out forwards;
`;
const ImageWrapper = styled.div`
  position: absolute;
  top: 35vh;
  left: 10vw;
  width: 80vw;
`;
const StyledImage = styled.img`
  width: 100%;
  opacity: 0.85;
  animation: ${fadeInUp} 2s ease-out forwards;
`;

const MainPage = () => {
  const [showLanding, setShowLanding] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoLogin = () => {
    navigate('/login');
  };
  const handleGoSignUp = () => {
    navigate('/signup');
  };

  return (
    <Wrapper>
      {showLanding ? (
        <>
          <Title>Re:meet</Title>
          <ImageWrapper>
            <StyledImage src="/LandingImage.svg" alt="Landing Image" />
          </ImageWrapper>
        </>
      ) : (
        <>
          <Title>Re:meet</Title>
          <ButtonWrapper>
            <Button onClick={handleGoLogin}>로그인</Button>
            <Button onClick={handleGoSignUp}>회원가입</Button>
          </ButtonWrapper>
        </>
      )}
    </Wrapper>
  );
};

export default MainPage;
