import type { NextApiRequest, NextApiResponse } from 'next';

const usuarios = [
  {
    id: 1,
    nombre: 'Lauri Vera',
    correo: 'lauri@otaway.ec',
    creadoEn: new Date().toISOString(),
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(usuarios);
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ message: 'Método no permitido' });
}
