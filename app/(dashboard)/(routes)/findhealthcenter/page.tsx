import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import HealthCenter from "@/components/NearbyCenters";
import { Providers } from "@/components/QueryClientProvider/Providers";

const Page = async () => {
  
  const user = await currentUser();
  return (
        <Providers>
   <HealthCenter/>
   </Providers>
  );
};

export default Page;
