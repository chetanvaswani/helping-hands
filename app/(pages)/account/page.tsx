export const dynamic = 'force-dynamic';

import UserProfile from "@/components/UserProfile";
import { getServerSession } from "next-auth/next";
import {authOptions} from "@/lib/auth";
import { headers } from "next/headers";
import axios from "axios";
import {User} from "@/schemas/UserSchema"
import RedirectToSignin from "@/components/RedirectToSignin";

export default async function Account(){
    const session = await getServerSession(authOptions);
    if (!(session?.user.mobileNumber)){
        return (
            <div className="h-full w-full flex justify-center items-center bg-gray-100">       
                <RedirectToSignin text="Please Sign-In using your mobile number to view your account details." />         
            </div>
        )
    }
  
    const cookie = (await headers()).get("cookie") || "";
    const url = `${process.env.NEXTAUTH_URL}/api/v1/user`;
    const userResponse = await axios.get(url, {
        headers: { cookie },
    });

    const user: User = {
        name: userResponse.data.data.name,
        mobileNumber: userResponse.data.data.mobileNumber,
        email: userResponse.data.data.email,
        referralCode: userResponse.data.data.referralCode
    }

    console.log(user)

    return (
        <div className="overflow-y-scroll w-full h-full flex flex-col justify-start gap-2 items-center">
            <UserProfile mobileNumber={user.mobileNumber} name={(user.name).toLowerCase() !== "user" ? user.name : null} />
        </div>
    )
}