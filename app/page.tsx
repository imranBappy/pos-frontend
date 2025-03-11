// 'use client';
// import useAuth from "@/hooks/use-auth";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";


export default function Home() {
  // const router = useRouter()
  // const checkAuth = useAuth()

  // useEffect(() => {
  //   if (checkAuth?.isAuthenticated) {
  //     router.push('/orders/pos')
  //   } else {
  //     router.push('/login')
  //   }
  // }, [checkAuth?.isAuthenticated, router])
 
  return ( 
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-background dark:bg-background">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 mt-3">
        <div className="aspect-video rounded-xl bg-muted dark:bg-muted/20" >
          {/* <Chart /> */}

        </div>
        <div className="aspect-video rounded-xl bg-muted dark:bg-muted/20" >
          {/* <Bar /> */}
        </div>

        <div className="aspect-video rounded-xl bg-muted dark:bg-muted/20 " >
          {/* <Pie_ /> */}
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted dark:bg-muted/20 md:min-h-min" />
    </div>
  );
}
