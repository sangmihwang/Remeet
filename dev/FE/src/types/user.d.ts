interface Login {
  userId: string;
  password: string;
}

interface User extends Login {
  userName: string;
  userEmail: string;
  imagePath?: string;
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
}

export { Login, User, SignUpForm, UserResponse };
