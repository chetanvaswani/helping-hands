import { IoCloseOutline } from "react-icons/io5";
import { ReactNode } from "react";

interface ModalProps {
    title: string,
    children: ReactNode,
    open: boolean,
    setOpen: (value: boolean) => void
  }

export default function Modal({
     title, 
     children,
     open,
     setOpen
}: ModalProps){

    if (open){
        return (
            <div id="modal-background" className="h-full w-full z-200 bg-opacity-0 bg-black-50 absolute top-0 left-0 flex justify-center items-center" onClick={(event) => {
                if(event.target == document.getElementById('modal-background')){
                    setOpen(false)
                }
            }} >
                <div className="h-fit w-[90%] bg-white rounded-xl p-5" >
                    <div className="flex w-full items-center justify-between" >
                        <div className="text-xl text-black font-normal" >{title}</div>
                        <IoCloseOutline className="size-6 cursor-pointer text-gray-500 rounded-lg hover:bg-gray-100 hover:text-black" onClick={() => {
                            setOpen(false)
                        }} />
                    </div>
                    {children}
                </div>
            </div>
        )
    }
}