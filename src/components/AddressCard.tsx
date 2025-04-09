import { GoHome } from "react-icons/go";
import { SlOptionsVertical } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { PiBuildingOffice } from "react-icons/pi";
// import { useRecoilState } from "recoil";
// import { addressesAtom } from "@/store/atoms/addressesAtom";
// import { currentAddressAtom } from "@/store/atoms/currentAddressAtom";
import { toTitleCase } from "@/utils/toTitleCase";


interface AddressCardInterface{
    name: string,
    type: "home" | "work" | "other",
    address: string,
    currDistance?: string,
    longitude?: string,
    latitude?: string
}

export default function AddressCard({name, type, address, currDistance} : AddressCardInterface){
    // const [savedAddresses, setSavedAddresses] = useRecoilState(addressesAtom);
    // const [currentAddress, setCurrentAddress] = useRecoilState(currentAddressAtom)
    
    return (
        <div className="w-full shadow-md p-5 gap-3 flex justify-evenly items-start rounded-lg h-fit bg-white" onClick={() => {

        }}>
            <div className="flex flex-col gap-1 items-center">
                {
                    type === "home" ? 
                    <GoHome className="size-5 text-gray-600" />
                    : type === "work" ? 
                    <PiBuildingOffice className="size-5 text-gray-600" /> :
                    <IoLocationOutline className="size-5 text-gray-600" />
                }
                {
                        currDistance && Number(currDistance) < 10 ? 
                        <span className="text-xs text-gray-400">(0m)</span> : 
                        currDistance && Number(currDistance) < 1000 ? 
                        <span className="text-xs text-gray-400">({Number(currDistance).toFixed(0)}m)</span> : 
                        currDistance && Number(currDistance) < 10000 ? 
                        <span className="text-xs text-gray-400">({(Number(currDistance)/1000).toFixed(1)}km)</span> :
                        currDistance && Number(currDistance) > 10000 ? 
                        <span className="text-xs text-gray-400">({(Number(currDistance)/1000).toFixed(0)}km)</span>
                        : false
                }
            </div>
            <div className="w-[80%] flex flex-col -mt-1">
                <div className="font-semibold gap-1 items-center flex text-base">
                    <span>{toTitleCase(name)}</span>
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