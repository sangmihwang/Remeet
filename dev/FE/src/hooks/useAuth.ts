import { useRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';
import { User } from '@/types/user';
import userState from '@/store/user';
import { getUserInfo } from '@/api/user';

const useAuth = () => {
  const [userInfo, setUserInfo] = useRecoilState<User | null>(userState);
  const refreshUserInfo = useCallback(async () => {
    getUserInfo()
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!userInfo) {
      refreshUserInfo()
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  });
  return { userInfo, setUserInfo, refreshUserInfo };
};

export default useAuth;
