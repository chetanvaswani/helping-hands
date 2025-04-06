const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export default function Dashboard(){
    return (
        <div className="h-svh w-full p-5 gap-5 bg-gray-100 flex flex-col items-center">
            <div className="fixed bg-white top-0 left-0 h-[60px] z-100 w-full px-2 text-2xl font-bold border-b-2 border-black">
                <p className="p-4">Dashboard</p>
            </div>
            <div className="relative top-[60px] flex flex-col items-center w-full gap-5 overflow-y-scroll">
                <div className="flex flex-col w-full justify-center shadow-lg rounded-xl items-center bg-white">
                    <div className="w-full py-2 px-3 font-semibold">
                        Purchases
                    </div>
                    <PurchasesTable />
                </div>
                <div className="flex w-full flex-col justify-center shadow-lg rounded-lg items-center bg-white">
                    <Calander />
                </div>
            </div>
        </div>
    )
}

function mostlyTrue() {
    return Math.random() >= 0.05;    
}

function Calander(){
    const date = new Date();
    const today = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    // Gets the first DAY of current month
    const dayone = new Date(year, month, 1).getDay();
    // Gets the last DATE of current month
    const lastdate = new Date(year, month + 1, 0).getDate();
    // Get the last date of the previous month
    const monthlastdate = new Date(year, month, 0).getDate();

    const calander : any = [];

    for (let i=(-(dayone - 1) ); i <= lastdate; i++){
        if (i < 0){
            calander.push({
                date: monthlastdate + (i + 1),
                month: month - 1,
                day: dayone + i
            })
        } 
        if (i > 0) {
            calander.push({
                date: i,
                month: month,
                day: dayone + (i - 1)
            })
        }
    }
    const current = {
        date: today,
        month: month
    }

    return (
        <div className="w-[90%] py-2 flex flex-col justify-center">
        <div className="text-left w-full p-1 font-semibold text-lg">
            Calander <p className="inline text-sm font-light">{`(${MONTHS[current.month]})`}</p>
        </div>
        <div className="flex w-full font-semibold justify-start">
            {
                DAYS.map((day) => {
                    return (
                        <p key={day} className="inline-flex justify-center py-1 w-[14.2%]">{day}</p>
                    )
                })
            }
        </div>
        <div className="w-full flex flex-wrap justify-start">
            {
                calander.map((c) => {
                    const attendence = mostlyTrue();
                    return (
                        <div key={`${c.date}/${c.month}`} className={`w-[14.2%] h-[30px] my-[3px] flex justify-center items-center gap-2 ` }>
                            <div className={` w-[80%] flex justify-center items-center h-[100%] text-center  rounded-md ${c.month !== current.month ? "text-gray-300 bg-transparent" : false} ${c.date === current.date && c.month === current.month ? "border-1 border-black rounded-md" : false} ${ c.date > current.date ? "bg-transparent": attendence ? "bg-green-300" : " bg-red-300"}`}>
                                <div>
                                    {c.date}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        </div>
    )
}


function PurchasesTable(){
    return (
        <table className="w-full text-sm text-left rtl:text-right rounded-sm ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
            <tr>
                <th scope="col" className="px-6 py-2">
                    Service
                </th>
                <th scope="col" className="px-6 py-2">
                    Date
                </th>
                <th scope="col" className="px-6 py-2">
                    Amount
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                    House Help
                </th>
                <td className="px-6 py-2">
                    28/01/25
                </td>
                <td className="px-6 py-2">
                    3000
                </td>
            </tr>
            <tr className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap ">
                    Driver
                </th>
                <td className="px-6 py-2">
                    12/02/25
                </td>
                <td className="px-6 py-2">
                    500
                </td>
            </tr>
            <tr className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                    House Help
                </th>
                <td className="px-6 py-2">
                    28/12/24
                </td>
                <td className="px-6 py-2">
                    3000
                </td>
            </tr>
            <tr className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                    House Help
                </th>
                <td className="px-6 py-2">
                    28/11/24
                </td>
                <td className="px-6 py-2">
                    3000
                </td>
            </tr>
        </tbody>
    </table>
    )
}