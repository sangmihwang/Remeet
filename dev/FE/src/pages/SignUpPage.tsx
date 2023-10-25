import { useState } from 'react';
import { InputText, LargeButton } from '@/components/common';
import PageHeader from '@/components/navbar/PageHeader';
import User from '@/types/user';

const SignUpPage = () => {
  const [signUpForm, setSignUpForm] = useState<User>({
    userid: '',
    password: '',
    name: '',
    imagePath: '',
  });

  const handleIdChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      userid: e,
    }));
  };
  const handleNameChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      name: e,
    }));
  };
  const handlePasswordChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      password: e,
    }));
  };

  const headerContent = {
    left: 'Back',
    title: '회원가입',
    right: 'Login',
  };
  return (
    <>
      <PageHeader content={headerContent} type={1} />
      <InputText
        type="text"
        placeholder="아이디"
        value={signUpForm.userid}
        onChange={handleIdChange}
      />
      <InputText
        type="text"
        placeholder="이름"
        value={signUpForm.name}
        onChange={handleNameChange}
      />
      <InputText
        type="password"
        placeholder="비밀번호"
        value={signUpForm.password}
        onChange={handlePasswordChange}
      />
      <LargeButton content="회 원 가 입" />
    </>
  );
};

export default SignUpPage;
