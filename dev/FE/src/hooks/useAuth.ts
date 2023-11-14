import { useRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';
import { UserResponse } from '@/types/user';
import userState from '@/store/user';
import { getUserInfo } from '@/api/user';

const useAuth = () => {
  const [userInfo, setUserInfo] = useRecoilState<UserResponse | null>(
    userState,
  );
  const refreshUserInfo = useCallback(async () => {
    getUserInfo()
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!userInfo) {
      refreshUserInfo()
        .then(() => {})
        .catch(() => {});
    }
  }, []);
  return { userInfo, setUserInfo, refreshUserInfo };
};

export default useAuth;
