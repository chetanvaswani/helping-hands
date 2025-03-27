"use client"
import { SlHome } from "react-icons/sl";
import { HiHome } from "react-icons/hi";
import { IoMdHelpCircleOutline, IoMdHelpCircle } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { RiAccountCircleFill } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { usePathname } from 'next/navigation';
import { MdOutlineDashboard } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { useSession } from "next-auth/react";
import { toTitleCase } from "@/utils/toTitleCase"

export default function Footer(){
  const pathname = usePathname();
  const session = useSession();
  const [currPage, setCurrPage] = useState(pathname.replace("/", ''))

  return (
    <div className="overflow-hidden fixed bottom-0 left-0 w-full bg-black flex justify-evenly items-center z-10 h-[60px]">
          <FooterButton name="home" Active={HiHome} InActive={SlHome} currPage={currPage} setCurrPage={setCurrPage} />
          {
            session.status === "authenticated"
              ? <FooterButton name="dashboard" Active={MdDashboard} InActive={MdOutlineDashboard} currPage={currPage} setCurrPage={setCurrPage} />
              : false
          }
          <FooterButton name="help" Active={IoMdHelpCircle} InActive={IoMdHelpCircleOutline} currPage={currPage} setCurrPage={setCurrPage} />
          <FooterButton name="account" Active={RiAccountCircleFill} InActive={VscAccount} currPage={currPage} setCurrPage={setCurrPage} />
    </div>
  );
}

interface FooterButtonProps {
  Active: React.ElementType,
  InActive: React.ElementType,
  name: "home" | "help" | "account"| "dashboard",
  currPage: string,
  setCurrPage: (str: "home" | "help" | "account" | "dashboard") => void,
}

function FooterButton({ Active, InActive, name, currPage, setCurrPage }: FooterButtonProps) {
  const router = useRouter();
  return (
    <div
      className="flex flex-col w-[33%] items-center text-white text-sm cursor-pointer"
      onClick={() => {
        setCurrPage(name)
        router.push(`/${name}`)
      }}
    >
      { 
        currPage === name ? <Active className="w-5 h-5" /> :
        <InActive className="w-5 h-5" />
      }
      <div>{toTitleCase(name)}</div>
    </div>
  );
}