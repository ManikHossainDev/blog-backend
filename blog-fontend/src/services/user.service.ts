import { error } from "console";
import { cookies } from "next/headers"

export const userService = {
    getSession: async  function () {
        try{
            const cookieStore = await cookies();
            console.log(cookieStore);
            const res = await fetch(
              "http://localhost:3000/api/auth/get-session",
              {
                headers: {
                  Cookies: cookieStore.toString(),
                },
                cache: "no-store",
              },
            );

            const session = await res.json();
            console.log(session);

            if(!session.data  ===  null){
                return {data:null, error:{message:"session is missing"}}
            }

            return {data: session, error: null}
        }catch(err){
            console.error(err)
            return {data: null, error: {message: "Something wen wrong"}}
        }
    }
}