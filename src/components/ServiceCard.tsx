"use client"
import { SessionProvider, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export interface servicesInterface{
    name: string,
    img: string,
    active: boolean
}

interface ServiceDisplayInterface{
    service: servicesInterface,
}

export default function ServiceCard({service} : ServiceDisplayInterface){
    return (
        <SessionProvider>
            <ServiceCardReal service={service} />
        </SessionProvider>
    )
}

function ServiceCardReal({service} : ServiceDisplayInterface){
    const router = useRouter();
    const session = useSession();

    return (
        <div className="mt-5 bg-gradient-to-t shadow-md from-gray-300/50 to-gray-50 h-[150px] w-[90%] flex justify-evenly items-center rounded-2xl">
            <div className="flex flex-col gap-2 justify-center items-center">
            <div className="text-[25px] font-bold tracking-tight font-sans">
                {service.name}
            </div>
            <button disabled={!service.active} onClick={() => {
                if (session.status === "authenticated"){
                    router.push("/checkout")
                } else {
                    router.push('/signin')
                }
            }} className="bg-black cursor-pointer w-[150px] text-white outline-noneborder-none px-4 py-2 rounded-4xl transition-all hover:shadow-lg hover:-translate-y-1 active:shadow-inner active:translate-y-1 disabled:opacity-65 disabled:active:translate-y-0">
                {
                    service.active ? session.status === "authenticated" || session.status === "loading" ? <p>Book Now</p> : <p>Login to book</p> : <p>Comming Soon</p>
                }
            </button>
            </div>
            <Image src={service.img} alt={service.name} width={"150"} height={"200"} className="h-full !object-contain" />
        </div>
    )
}