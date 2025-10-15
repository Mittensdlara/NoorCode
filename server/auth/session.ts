import { authOptions } from './options';
import { getServerSession } from 'next-auth';

export async function getSession() {
  return getServerSession(authOptions);
}
