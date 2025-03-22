import Image from "next/image";
import SigninBox from "@/components/SigninBox";

export default function Signin({}){

    return (
        <div className="h-svh overflow-hidden gap-[20px] justify-start bg-gray-100 w-full items-center flex flex-col items-center">
            <div className="bg-white text-black w-full shadow-md p-5 font-bold">
                Helping Hands: India
            </div>
            <div>
                <Image src="/signin.png" alt="banner" height="200" width="300" className="" />
            </div>
            <SigninBox />
        </div>  
    )
}