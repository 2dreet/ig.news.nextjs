import { NextApiRequest, NextApiResponse } from 'next';
// aqui definimos um get users
// acessa via http://localhost:3000/api/users
// é um Serverless
export default (resquest: NextApiRequest, response: NextApiResponse) => {
  const users = [
    {id: 1, name: 'José'}
  ];

  return response.json(users);
}
