import AddressCard from "@/components/AddressCard";
import { IoIosArrowDown } from "react-icons/io";
import { MdAddLocationAlt } from "react-icons/md";


export default function Address(){
    return (
        <div className="h-screen overflow-hidden w-full bg-gray-100 flex flex-col items-center">
            <div className="h-[50px] flex items-center gap-2 w-[90%] m-2">
                <IoIosArrowDown className="size-4 stroke-1 mt-1" />
                <h2 className="font-semibold text-xl">
                    Select a location
                </h2>
            </div>
            <div className="w-[90%] shadow-md rounded-lg p-3 gap-2 justify-center items-center flex h-[50px] bg-white">
                <MdAddLocationAlt className="size-7 stroke-0 -mt-1" />
                <div className="font-semibold">Add a new address</div>
            </div>
            <div className="inline-flex items-center justify-center w-full">
                <hr className="w-[80%] h-[2px] my-8 bg-gray-200 border-0 rounded-sm" />
                <div className="absolute px-4 -translate-x-1/2 bg-gray-100 left-1/2 ">
                    <p className="text-gray-400 font-normal" >Saved Addresses</p>
                </div>
            </div>
            <AddressCard name="Home" type="other" address="House no. 99, Vaishali nagar, bhilai, chhattisgrah" />
        </div>
    )
}