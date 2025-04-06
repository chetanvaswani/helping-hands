import { GoHome } from "react-icons/go";
import { SlOptionsVertical } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";

interface AddressCardInterface{
    name: string,
    type: "home" | "other",
    address: string
}

export default function AddressCard({name, type, address} : AddressCardInterface){
    return (
        <div className="w-[90%] shadow-md p-5 gap-3 flex justify-evenly items-start rounded-lg h-fit bg-white">
            {/* <p className="text-gray-400 font-semibold text-center" >
                No saved address found
            </p> */}
            <div>
                {
                    type === "home" ? 
                    <GoHome className="size-5 text-gray-600" /> :
                    <IoLocationOutline className="size-5 text-gray-600" />
                }
            </div>
            <div className="w-[80%] flex flex-col -mt-1">
                <div className="font-semibold gap-1 items-center flex text-base">
                    <p>{name}</p>
                    {/* <div className="text-[9px] px-3 py-[2px] rounded-lg bg-black text-white">
                        CURRENT LOCATION
                    </div> */}
                </div>
                <div className="text-sm">
                    {address}
                </div>
            </div>
            <div className="w-[10%] flex flex-col gap-2 text-gray-500 items-end">
                <SlOptionsVertical className="mt-1 cursor-pointer" />
            </div>
        </div>
    )
}