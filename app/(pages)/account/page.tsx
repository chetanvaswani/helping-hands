import UserProfile from "@/components/UserProfile";
import { getServerSession } from "next-auth/next";
import {authOptions} from "@/lib/auth";
import RedirectToSignin from "@/components/RedirectToSignin";


export default async function Account(){
    const session = await getServerSession(authOptions)

    if (!(session?.user.mobileNumber)){
        return (
            <div className="h-full w-full flex justify-center items-center bg-gray-100">       
                <RedirectToSignin text="Please Sign-In using your mobile number to view your account details." />         
            </div>
        )
    }

    return (
        <div className="overflow-y-scroll w-full h-full flex flex-col justify-start gap-2 items-center">
            <UserProfile mobileNumber={session.user.mobileNumber} />
        </div>
    )
}