"use client"
import { FaArrowLeftLong } from "react-icons/fa6";
import Button from "@/components/Button";
import { TbLogout2 } from "react-icons/tb";
import { MdModeEdit } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { useSession, SessionProvider, signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

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
            <div className="w-full h-full bg-gray-100">
                <SessionProvider>
                    <SettingsMain />
                </SessionProvider>
            </div>
        </div>
    )
}

function SettingsMain(){
    const session = useSession();
    const [user, setUser] = useState({
        name: "",
        mobileNumber: "",
        email: ""
    })

    useEffect(() => {
        async function getUser(){
            try {
                const response = await axios.get(`/api/v1/user`, {
                    params: { mobileNumber: session.data?.user.mobileNumber },
                });
                console.log(response)
                setUser(response.data.data)
            } catch(err){
                console.log(err)
            }
        }
        console.log(session)
        if (session.status == "authenticated"){
            getUser()
        }
    }, [session])

    return (
        <div className="w-full h-full">
            <div className="my-5 w-full gap-5 h-full flex flex-col items-center font-medium rounded-lg">
                <Field name="Name" value={user.name == "User" ? null : user.name} absenceString="Add your name now" />
                <div className="w-full flex flex-col items-center">
                    <div className="w-[90%] font-semibold px-1 text-lg">
                        Mobile Number:
                    </div>
                    <div className="w-[90%] justify-between gap-[5px] px-3 font-semibold rounded-md bg-white h-[50px] items-center flex">
                    <div className=" w-full">
                        +91 { user.mobileNumber }
                    </div>
                    </div>
                </div>
                <Field name="Email" value={user.email} absenceString="Add your email now" />
            {
                session.status === "authenticated" ?
                <div className=" w-[90%] mt-5 flex flex-col">
                    <Button text="Logout" variant="dark" startIcon={<TbLogout2 className="size-5" />} onClick={() => {
                        signOut({ callbackUrl: window.location.href.replace("settings", "signin") });
                    }} />
                </div> : false
            }
            </div>
        </div>
    )
}

interface fieldProps{
    name: string,
    value: string | null,
    absenceString: string,
}

function Field({name, value, absenceString} : fieldProps){
    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-[90%] font-semibold px-1 text-lg">
                {name}:
            </div>
            <div className="w-[90%] justify-between gap-[5px] px-3 font-semibold rounded-md bg-white h-[50px] items-center flex">
            <div className=" w-full">
                {
                    value ? value : <div className="text-gray-500">{absenceString}</div>
                }
            </div>
            <div className=" cursor-pointer">
                {
                    value ? <MdModeEdit className="size-5" /> : <IoIosAdd className="size-7" />
                }
            </div>
            </div>
        </div>
    )
}