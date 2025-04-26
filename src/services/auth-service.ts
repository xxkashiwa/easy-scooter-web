import request from '@/lib/request';

const endPoint = '/auth';
const auth = async (account: string, password: string) => {
  const response = await request({
    url: `${endPoint}/login`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    data: {
      username: account,
      password: password,
    },
  });
  return response.data.access_token;
};
const checkAuth = async () => {
  console.log(
    await request({
      url: '/users/me',
      method: 'get',
    })
  );
};
export { auth, checkAuth };
