"use client"
import { useState } from "react";
import { QnA } from "@/app/assets/data/data";
import { IoIosArrowDown } from "react-icons/io";

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full flex-col h-full flex overflow-hidden ">
      <div className="fixed bg-white top-0 left-0 h-[60px] z-100 w-full px-2 text-2xl font-bold border-b-2 border-black">
        <p className="p-4">
            FAQ&#39;s
        </p>
      </div>
      <div className="top-[60px] flex flex-col h-[calc(100%-60px)] relative p-4 overflow-y-scroll w-full">
        {QnA.map((curr, index) => (
          <div
            key={index}
            className="shadow-md bg-white h-fit m-2 p-4 rounded-lg font-semibold"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="flex justify-between items-center">
              <div
                className={`w-[calc(100%-30px)] ${
                  openIndex === index ? "border-b border-dotted border-black pb-2" : ""
                }`}
              >
                {curr.question}
              </div>
              <IoIosArrowDown
                className={`transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </div>
            {openIndex === index && (
              <div className="mt-2 text-black font-normal">{curr.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
