"use client"
import { BiSolidUser } from "react-icons/bi";
import { MdOutlineSettings } from "react-icons/md";
import { useRouter } from "next/navigation";
import { toTitleCase } from "@/utils/toTitleCase";

export default function UserProfile({mobileNumber, name}){
    const router = useRouter();
    return (
        <div className=" m-5 mb-3 h-[100px] w-[90%] bg-white shadow-md flex rounded-4xl border-1 border-dashed border-black" onClick={() =>{
            router.push('/settings')
        }}>
            <div className=" ml-2 w-[25%] h-full flex justify-center items-center">
                <BiSolidUser className="size-13 border-2 border-black rounded-[50%] p-2" />
            </div>
            <div className="w-[75%] ml-1 h-full flex justify-between items-center">
                <div className="flex flex-col justify-center items-start" >
                    {
                        name && name.toLowerCase() !== "user" ? 
                        <div>
                            <div className="font-semibold !no-underline text-xl -m-1">{toTitleCase(name)}</div>
                            <div className="font-base !no-underline text-sm">+91 {mobileNumber}</div>
                        </div>
                        :
                        <div className="flex flex-col gap-[1px]">
                            <div className="text-lg font-semibold !no-underline">+91 {mobileNumber}</div>
                            <div className="text-sm leading-none w-[90%]">Add name and complete your profile</div>
                        </div>
                    }
                </div>
                <MdOutlineSettings className="size-9 text-black mr-6 cursor-pointer" />
            </div>
        </div>
    )
}