import { userService } from "@/services/user.service";


const Page = async () => {

 const {data, error } = await userService.getSession();
   
console.log(error, data)

 return (
 <div>
 <h2>Welcome to the Page page</h2>
 </div>
 );
};

export default Page;