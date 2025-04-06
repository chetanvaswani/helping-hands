import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/db/index";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.mobileNumber) {
            return NextResponse.json({
                    status: "failure",
                    data: {
                        msg: "User not authenticated"
                    }
                },
                { status: 401 }
            );
        }

        const addresses = await prisma.address.findMany({
            where: { User: { mobileNumber: session.user.mobileNumber } },
        });

        return NextResponse.json({ status: "success", data: { addresses } });
    } catch (err: any) {
        console.error("GET /api/v1/addresses error:", err);
        return NextResponse.json({
                status: "failure",
                data: { msg: "Internal Server Error", error: err.message }
            },
            { status: 500 }
        );
    }
}