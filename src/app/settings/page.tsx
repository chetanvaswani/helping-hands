import SettingsForm from "@/components/SettingsForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import axios from "axios";
import {User} from "@/schemas/UserSchema"

export default async function Settings(){
    const session = await getServerSession(authOptions);
    if (!session?.user.mobileNumber) {
        redirect("/signin");
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
    
    // console.log(userResponse.data);
  
    return (            
        <div className="h-svh w-full bg-gray-100 items-center flex flex-col p-4">
            <SettingsForm UserProp={user} />
        </div>
    )
}
