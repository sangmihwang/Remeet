import { atom } from 'recoil';
import { UserResponse } from '@/types/user';

const userState = atom<UserResponse | null>({
  key: 'userState',
  default: null,
});

export default userState;
