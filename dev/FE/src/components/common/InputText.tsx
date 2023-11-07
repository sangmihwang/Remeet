import { useEffect, useState } from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  margin: 1rem auto;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f6f6f6;
  width: 86vw;
  height: 3.2rem;
  padding: 0.9rem 1rem;
  border-radius: 0.5rem;
`;

const Input = styled.input`
  width: 70vw;
  line-height: 1.2rem;
  padding: 0;
  background-color: #f6f6f6;
  color: #000;
  border: 0px solid #e8e8e8;
  outline: 0;
  font-weight: 500;

  &::placeholder {
    color: #bdbdbd;
  }
`;

const DeleteButton = styled.div`
  background: url('/icon/delete_icon.svg');
  width: 1.2rem;
  height: 1.2rem;
  background-size: cover;
  background-repeat: no-repeat;
  border: 0;
  padding: 0;
  flex-shrink: 0;
`;

interface InputTextProps {
  value: string;
  placeholder: string;
  type: string;
  onChange: (e: string) => void;
}

const InputText = ({ value, onChange, placeholder, type }: InputTextProps) => {
  const [checkValue, setCheckValue] = useState<boolean>(false);

  useEffect(() => {
    if (value.length > 0) {
      setCheckValue(true);
    } else {
      setCheckValue(false);
    }
  }, [value]);

  return (
    <InputWrapper>
      <Input
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        value={value}
      />
      {checkValue && <DeleteButton onClick={() => onChange('')} />}
    </InputWrapper>
  );
};

export default InputText;
