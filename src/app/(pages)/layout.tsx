import Footer from "@/components/Footer";

export default function PagesLayout({children}: Readonly<{
    children: React.ReactNode;
  }>){
    return (
        <>
        <div className="h-svh bg-gray-50 w-full flex flex-col items-center justify-between overflow-x-hidden overflow-y-hidden ">
            <div className="w-full h-[calc(100%-60px)] overflow-hidden">
                {children}
            </div>
            <div className="w-full h-[60px] z-10">
                <Footer />
            </div>
        </div>
        </>
    )
}