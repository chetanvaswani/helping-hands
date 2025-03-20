import { IoIosArrowDown } from "react-icons/io";

export default function Address(){
    return (
        <div className="h-screen w-full bg-gray-100 flex flex-col items-center">
            <div className="h-[50px] flex items-center gap-2 w-[95%] mt-2 border-b-1 border-gray-500">
                <IoIosArrowDown className="size-5 stroke-1 mt-1" />
                <h2 className="font-semibold text-2xl">
                    Select a location
                </h2>
            </div>
        </div>
    )
}