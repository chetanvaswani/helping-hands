import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    mobileNumber: string;
    ip?: string;
  }

  interface Session {
    user: {
      mobileNumber: string;
      ip?: string;
    } & DefaultSession['user']
  }
}

declare module "next-auth/jwt" {
    interface JWT {
      mobileNumber: string;
      ip?: string;
    }
}