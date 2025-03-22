"use client"
import Button from "@/components/Button";
import { useRouter } from "next/navigation";


interface RedirectToSigninProps{
    text: string
}

export default function RedirectToSignin({text}: RedirectToSigninProps){
    const router = useRouter();
    return (
        <div className="w-[90%] bg-white p-5 flex flex-col items-center gap-5 shadow-lg rounded-lg">
            <div className="font-semibold text-gray-800 w-full text-center">
                {text}
            </div>
            <div className="w-[90%] flex flex-col">
                <Button text="Go To Sign In Page" variant="dark" onClick={() => {
                    router.push('/signin')
                }} />
            </div>
        </div>
    )
}