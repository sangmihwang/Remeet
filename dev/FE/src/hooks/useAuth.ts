// import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
// import { getUserInfo } from '@/api/user';
import { User } from '@/types/user';
import userState from '@/store/user';

const useAuth = () => {
  const [userInfo, setUserInfo] = useRecoilState<User | null>(userState);
  // const refreshUserInfo = useCallback(async () => {
  //   const newUserInfo = await getUserInfo();
  //   setUserInfo(newUserInfo);
  // }, []);

  //   useEffect(() => {
  //     if (!userInfo && accessToken && !isRefresh) {
  //       isRefresh = true;
  //       refreshUserInfo().then(() => {
  //         isRefresh = false;
  //       });
  //     }
  //   }, []);

  //   useEffect(() => {
  //     if (!refreshToken) {
  //       setUserInfo(undefined);
  //     }
  //   }, [refreshToken]);

  return { userInfo, setUserInfo };
};

export default useAuth;
