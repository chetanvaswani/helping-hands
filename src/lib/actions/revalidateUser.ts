import { revalidateTag } from 'next/cache';

export function revalidateUserCache(mobileNumber: string) {
  revalidateTag(`user-${mobileNumber}`);
}