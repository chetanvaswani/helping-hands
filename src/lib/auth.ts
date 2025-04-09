import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from "@/db/index";
import { NextAuthOptions } from "next-auth";
import { JWT } from 'next-auth/jwt';

export const authOptions = {
    providers: [
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            mobNum: { label: "Mobile Number", type: "text" },
            otp: { label: "OTP", type: "text" },
          },
          async authorize(credentials: any): Promise<any>  {
            const otpRecord = await prisma.otp.findFirst({
                where: { mobNo: credentials.mobNum, isUsed: false },
                orderBy: {
                  createdAt: "desc",
                },
                select: {
                  id: true,
                  expiry: true,
                  otp: true
                }
            });

            if (!otpRecord) {
                throw new Error("OTP not found or already used.");
            } 
            if (new Date() > otpRecord.expiry) {
                throw new Error("OTP expired.");
            } if (otpRecord.otp !== credentials.otp) {
                throw new Error("Invalid OTP.");
            }

            await prisma.otp.update({
                where: { id: otpRecord.id },
                data: { isUsed: true },
                select: {
                  id: true,
                  isUsed: true,
                }
            });

            let user = await prisma.user.findUnique({
                where: { mobileNumber: credentials.mobNum },
                select: {
                  mobileNumber: true,
                  name: true
                }
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                      mobileNumber: credentials.mobNum, 
                      name: "User"
                    },
                });
            }
            return user;
          },
        }),
      ],
      session: {
        strategy: "jwt"
      },
      jwt: {

      },
      secret: process.env.NEXTAUTH_SECRET,
      callbacks: {
        async jwt({ token, user }): Promise<JWT>{
          // console.log("console reached jwt callback")
          if (user){
            token.mobileNumber = user.mobileNumber
          }
          return token
        },
        async session({ session, token }) {
          // console.log("console reached session callback")
          // console.log(session, token)
          session.user = {
            mobileNumber: token.mobileNumber
          }
          return session;
        },
      }
} satisfies NextAuthOptions;