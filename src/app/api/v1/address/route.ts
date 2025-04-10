import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/db/index";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.mobileNumber) {
        return NextResponse.json(
          { status: "failure", message: "User not authenticated" },
          { status: 401 }
        );
      }
      const mobileNumber = session.user.mobileNumber;
      
      const body = await req.json();
      const { address, type, latitude, longitude } = body;
      let { name } = body;

      if (type !== "other"){
        name = type
      }
      
      const user = await prisma.user.findUnique({
        where: { mobileNumber },
      });
      
      if (!user) {
        return NextResponse.json(
          { status: "failure", message: "User not found" },
          { status: 404 }
        );
      }
      
      const newAddress = await prisma.address.create({
        data: {
          userId: user.id,
          address,
          type,
          latitude: Number(latitude),
          longitude: Number(longitude),
          name: name,
        },
      });
      
      return NextResponse.json(
        { status: "success", data: newAddress },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Error creating address:", error);
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 500 }
      );
    }
}

export async function DELETE(req: Request) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.mobileNumber) {
      return NextResponse.json(
        { status: "failure", message: "User not authenticated" },
        { status: 401 }
      );
    }
    const mobileNumber = session.user.mobileNumber;
    
    // Parse the request body to extract the address id
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { status: "failure", message: "Address id is required" },
        { status: 400 }
      );
    }
    
    const deleteResult = await prisma.address.delete({
      where: {
        id: Number(id),
        User: {
          mobileNumber: mobileNumber,
        },
      },
    });
    console.log(deleteResult)
    
    if (!deleteResult) {
      return NextResponse.json(
        { status: "failure", message: "Not authorized or address not found" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { status: "success", data: { deletedCount: deleteResult } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
  