import get from 'lodash/get';
import md5 from 'md5';
import { UserInfo } from 'models/user';
import type { NextApiRequest, NextApiResponse } from 'next';
import { logInWithEmailAndPassword } from 'services/firebase';

interface ResponseData {
  data: {
    tokens: {
      accessToken: string;
      expirationTime: number;
      refreshToken: string;
    };
    userInfo: UserInfo;
    message: string;
  } | null;
  error?: {
    message: string;
  };
}

const postLogin = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    logInWithEmailAndPassword(email, md5(password))
      .then((response) => {
        if (response) {
          const { user } = response;
          const stsTokenManager = get(user, 'stsTokenManager');
          const { accessToken, expirationTime, refreshToken } = stsTokenManager;

          return res.status(200).json({
            data: {
              tokens: {
                accessToken,
                expirationTime,
                refreshToken
              },
              userInfo: {
                email: get(user, 'email') as string,
                fullName: get(user, 'displayName') as string,
                phone: get(user, 'phoneNumber') as string,
                uid: get(user, 'uid') as string,
                createdAt: get(user, 'metadata.createdAt') as string,
                status: get(user, 'status') as string,
                avatar: get(user, 'photoURL') as string,
                type: get(user, 'type') as string
              },
              message: 'Đăng nhập thành công'
            }
          });
        }
      })
      .catch((error) => {
        return res.status(500).json({ data: null, error: { message: get(error, 'message') } });
      });
  }
};

export default postLogin;