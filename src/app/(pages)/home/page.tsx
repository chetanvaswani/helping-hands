import { TbCurrentLocation } from "react-icons/tb";
import LocationSelector from "@/components/LocationSelector";
import ServiceCard from "@/components/ServiceCard";
import { getServerSession } from "next-auth/next";
import {authOptions} from "@/lib/auth";


export interface servicesInterface{
    name: string,
    img: string,
    active: boolean
}
  
const SERVICES : servicesInterface[] = [ 
    { name: "House Help", img: "/maid.png", active: true },
    { name: "AC Service", img: "/ac-service.png", active: true },
    { name: "Driver", img: "/driver.png", active: true },
    { name: "Cook", img: "/cook.png", active: false },
]

export default async function Home() {
  const session = await getServerSession(authOptions)

  console.log(session?.user.mobileNumber)
  return (
    <div className="w-full flex-col h-full flex overflow-hidden">
      <div className="fixed top-0 w-full z-10">
        <LocationSelector title={"Welcome"} subTitle={"Vaishali Nagar Bhilai"} Icon={<TbCurrentLocation className="mr-5 w-8 h-8" />} />
      </div>
      <div className=" relative top-[50px] py-5 h-[calc(100%-70px)] overflow-y-scroll w-full flex flex-col items-center">
        { SERVICES.map(
          (service, index) => (
            <ServiceCard key={`${index}${service.name}`} service={service}/>
          )
        )}
      </div>
    </div>
  );
}