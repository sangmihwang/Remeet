import { ImageFile } from './upload';

interface Login {
  userId: string;
  password: string;
}

interface User extends Login {
  userName: string;
  userEmail: string;
  imagePath?: string | ImageFile | null;
}

interface SignUpForm extends User {
  passwordCheck: string;
}

interface UserResponse extends User {
  userNo: number;
  tokenResponse: {
    accessToken: string;
    refreshToken: string;
  };
  commonHoloPath?: string;
}

export { Login, User, SignUpForm, UserResponse };
