import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import styled from 'styled-components';
import { InputText, LargeButton } from '@/components/common';
import PageHeader from '@/components/navbar/PageHeader';
import { SignUpForm } from '@/types/user';
import { getCheckUserId, userSignUp } from '@/api/user';
import { ImageFile } from '@/types/upload';

const ErrorText = styled.div`
  width: 86vw;
  margin: 0 auto;
  font-size: 0.75rem;
  color: var(--primary-color);
`;

const Label = styled.label`
  width: 26px;
  height: 26px;
  border: 2px solid var(--primary-color);
  border-radius: 100%;
  background-image: url('/icon/plus_icon.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
  position: absolute;
  right: 0;
`;

const Input = styled.input`
  display: none;
`;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    userId: '',
    password: '',
    passwordCheck: '',
    userName: '',
    userEmail: '',
    imagePath: null,
  });
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);

  const [checkForm, setCheckForm] = useState({
    idCheck: true,
    passwordCheck: true,
    allCheck: false,
  });

  useEffect(() => {
    const isTruePassword = signUpForm.password === signUpForm.passwordCheck;
    if (isTruePassword) {
      setCheckForm((prev) => ({ ...prev, passwordCheck: true }));
    } else {
      setCheckForm((prev) => ({ ...prev, passwordCheck: false }));
    }
  }, [signUpForm.password, signUpForm.passwordCheck]);

  useEffect(() => {
    setCheckForm((prevState) => ({
      ...prevState,
      allCheck: !Object.values(signUpForm).includes(''),
    }));
  }, [signUpForm]);

  useQuery(
    ['checkId', signUpForm.userId],
    () => getCheckUserId(signUpForm.userId),
    {
      enabled: !!signUpForm.userId,
      retry: false,
      onSuccess: () => {
        setCheckForm((prev) => ({ ...prev, idCheck: false }));
      },
      onError: () => {
        setCheckForm((prev) => ({ ...prev, idCheck: true }));
      },
    },
  );

  const handleIdChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      userId: e,
    }));
  };
  const handleNameChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      userName: e,
    }));
  };
  const handlePasswordChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      password: e,
    }));
  };
  const handlePasswordCheckChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      passwordCheck: e,
    }));
  };
  const handleEmailChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      userEmail: e,
    }));
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      const newImageFile: ImageFile = {
        blob: file,
        url,
      };
      setImageFile(newImageFile);
    }
  };

  const mutation = useMutation<AxiosResponse, Error, SignUpForm>(userSignUp, {
    onSuccess: (res) => {
      console.log(res);
      navigate('/login');
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSingUpClick = () => {
    if (checkForm.allCheck) {
      const formData = new FormData();
      // Object.keys(signUpForm).forEach((key) => {
      //   formData.append(key, signUpForm[key]);
      // });
      formData.append(
        'data',
        new Blob([JSON.stringify(signUpForm)], { type: 'application/json' }),
      );
      if (imageFile) {
        formData.append('imagePath', imageFile.blob);
      }
      mutation.mutate(signUpForm);
    } else {
      alert('항목을 전부 채워주세요');
    }
  };

  const handleGoLogin = () => {
    navigate('/login');
  };

  const headerContent = {
    left: 'Back',
    title: '회원가입',
    right: 'Login',
  };
  return (
    <>
      <PageHeader
        content={headerContent}
        type={1}
        rightButtonClick={handleGoLogin}
      />
      <InputText
        type="text"
        placeholder="아이디"
        value={signUpForm.userId}
        onChange={handleIdChange}
      />
      {checkForm.idCheck && signUpForm.userId.length > 0 && (
        <ErrorText>다른 아이디를 사용해 주세요.</ErrorText>
      )}
      <InputText
        type="text"
        placeholder="이름"
        value={signUpForm.userName}
        onChange={handleNameChange}
      />
      <InputText
        type="password"
        placeholder="비밀번호"
        value={signUpForm.password}
        onChange={handlePasswordChange}
      />
      <InputText
        type="password"
        placeholder="비밀번호 확인"
        value={signUpForm.passwordCheck}
        onChange={handlePasswordCheckChange}
      />
      {!checkForm.passwordCheck && signUpForm.passwordCheck.length > 0 && (
        <ErrorText>비밀번호를 다시 한번 확인해 주세요.</ErrorText>
      )}
      <InputText
        type="email"
        placeholder="이메일"
        value={signUpForm.userEmail}
        onChange={handleEmailChange}
      />
      <Label htmlFor="AudioUploadInput">
        <Input
          id="AudioUploadInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Label>
      {imageFile && <img src={imageFile.url} alt={imageFile.blob.name} />}

      <LargeButton onClick={handleSingUpClick} content="회 원 가 입" />
    </>
  );
};

export default SignUpPage;
