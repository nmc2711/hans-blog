import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';

export async function getCurrentUser() {
  const sessiton = await getServerSession(authOptions);

  return sessiton?.user;
}
