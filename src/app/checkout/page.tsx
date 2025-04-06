"use client"
import { useState } from "react";
import { CiDiscount1 } from "react-icons/ci";
import { HiArrowLongLeft } from "react-icons/hi2";
import LocationSelector from "@/components/LocationSelector";
import { TbListNumbers } from "react-icons/tb";
import { useRouter } from 'next/navigation';

type Duration = {
    name:  "once" | "monthly" | "custom";
    price: number
    discount: number
    tax: number
    total: number
}

export default function Checkout(){
    const router = useRouter();
    const [selectedDuration, setSelectedDuration] = useState<Duration['name']>("once")

    return (
        <div className="w-full h-svh flex flex-col items-center bg-gray-100 overflow-hidden ">
            <div className="w-full px-2 flex justify-center items-center bg-white" >
                <div className="pl-[25px] w-[20%]">
                    <HiArrowLongLeft className="h-[70px] cursor-pointer size-9 pl-2 border-b-2 border-gray-200" onClick={() => {
                        router.push('/home')
                    }} />
                </div>
                <div className="w-full">
                    <LocationSelector title={"Home"} subTitle={"Vaishali Nagar Bhilai"} />
                </div>
            </div>
            <div className=" w-[90%] flex items-center flex-col gap-4 mt-5">
                <BookingDurationSlider selectedDuration={selectedDuration} setSelectedDuration={setSelectedDuration} />
                <div className="flex bg-white h-[50px] shadow-md rounded-lg w-[95%] p-4 items-center">
                    <input className="bg-white w-full outline-0 " type="number" placeholder="Enter number of hours" min={1} max={4} onChange={(e) => {
                        if (parseInt(e.target.value) > 4 || parseInt(e.target.value) < 1){
                            e.target.value = ""
                            e.target.placeholder = "Value must be between 1-4"
                            setTimeout(() => {
                                e.target.placeholder = "Enter number of hours"
                            }, 1500)
                        }
                    }} />
                    <TbListNumbers className="size-6 text-gray-500 stroke-[1.5px] " />
                </div>
                <div className="flex bg-white shadow-md h-[50px] rounded-lg w-[95%] p-4 items-center">
                    <input className="bg-white w-full outline-0 " placeholder="Enter Cupon Code" />
                    <CiDiscount1 className="size-7 text-gray-500" />
                </div>
                <div className="w-[95%] bg-white shadow-md p-4 rounded-xl font-semibold flex flex-col gap-1">
                    <div className="flex justify-between ">
                        <p className="">Amount</p>
                        <p>₹149</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Discount</p>
                        <p>₹50</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Good & Service Tax</p>
                        <p>₹18</p>
                    </div>
                    <div className="border-b-1 border-dotted border-black mt-2"/>
                    <div className="flex justify-between">
                        <p>Total</p>
                        <p>₹117</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface BookingDurationSliderInterface{
    selectedDuration: Duration["name"],
    setSelectedDuration: ( duration: Duration["name"] ) => void
}

function BookingDurationSlider({
    selectedDuration,
    setSelectedDuration
}: BookingDurationSliderInterface){
    const durations: Duration["name"][] = ["once", "monthly", "custom"] 

    return (
        <div className="w-[97%] h-[50px] bg-gray-950 border-1 border-black rounded-4xl flex justify-center items-center">
            {
                durations.map((duration) => {
                    return (
                        <div key={duration} 
                        className={`w-[33%] cursor-pointer text-center flex items-center justify-center h-[90%] rounded-4xl ${selectedDuration === duration ? "bg-white text-black" : "text-white"}`} onClick={() => {
                            setSelectedDuration(duration)
                        }}>
                            {duration}
                        </div>
                    )
                })
            }
        </div>
    )
}
