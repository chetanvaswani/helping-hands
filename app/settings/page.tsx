"use client"
import { FaArrowLeftLong } from "react-icons/fa6";
import Button from "@/components/Button";
import { TbLogout2 } from "react-icons/tb";
import { useSession, SessionProvider, signOut } from "next-auth/react"
import { useRouter } from "next/navigation";

export default function Settings(){
    const router = useRouter();
    
    return (            
        <div className="h-svh w-full bg-gray-100 items-center flex flex-col p-4">
            <div className="w-full p-2 flex items-center gap-3 border-b-1 border-gray-600 pb-3 ">
                <FaArrowLeftLong className="size-4 stroke-0 text-gray-900 cursor-pointer" onClick={() => {
                    router.back()
                }} />
                <div className="font-bold text-xl">
                    Account Settings
                </div>
            </div>
            <div className="w-full">
                <SessionProvider>
                    <SettingsMain />
                </SessionProvider>
            </div>
        </div>
    )
}

function SettingsMain(){
    const session = useSession();
    return (
        <div>
            {
                session.status === "authenticated" ?
                <div className="absolute bottom-[20px] w-[90%] flex flex-col">
                    
                    <Button text="Logout" variant="dark" startIcon={<TbLogout2 className="size-5" />} onClick={() => {
                        signOut({ redirect: true, callbackUrl: "/signin" });
                    }} />
                </div> : false
            }
        </div>
    )
}