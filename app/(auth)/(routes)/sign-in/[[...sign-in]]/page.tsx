"use client";
import { SignUp } from "@clerk/nextjs";
export const runtime = "edge";
export default function Page() {
  return(
    <div className="flex justify-center items-center mt-12">
   <SignUp />
   </div>
  )
}
