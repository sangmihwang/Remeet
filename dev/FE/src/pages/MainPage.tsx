import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: var(--primary-color);
  height: 100vh;
`;

const Title = styled.div`
  position: absolute;
  top: 17vh;
  left: 10vw;
  color: #fff;
  font-size: 2.125rem;
  font-weight: 700;
  width: fit-content;
  height: fit-content;
`;

const ButtonWrapper = styled.div`
  box-sizing: border-box;
  position: absolute;
  bottom: 17vh;
  width: 100vw;
  padding: 0 10vw;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  box-sizing: border-box;
  min-width: 35vw;
  height: 4rem;
  padding: 1rem 2rem;
  border: 0;
  border-radius: 10px;
  background-color: #fff;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
`;

const MainPage = () => {
  const navigate = useNavigate();

  const handleGoLogin = () => {
    navigate('/login');
  };
  const handleGoSignUp = () => {
    navigate('/signup');
  };
  return (
    <Wrapper>
      <Title>Re:meet</Title>
      <ButtonWrapper>
        <Button onClick={handleGoLogin}>로그인</Button>
        <Button onClick={handleGoSignUp}>회원가입</Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default MainPage;
