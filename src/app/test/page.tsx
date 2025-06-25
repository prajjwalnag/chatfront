import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.N8N_API_KEY;
  console.log('API Key:', apiKey); // Log the API key for debugging purposes
  res.status(200).json({ key: apiKey ?? 'undefined' });
}
