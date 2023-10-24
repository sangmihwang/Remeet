import { InputText } from '@/components/common';

const MainPage = () => {
  return (
    <div>
      <InputText type="text" placeholder="Name" />
      <InputText type="email" placeholder="Email" />
      <InputText type="password" placeholder="Password" />
    </div>
  );
};

export default MainPage;
