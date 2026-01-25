import { authClient } from "@/lib/auth-client";

const Page = async () => {
const session = authClient.getSession();
 return (
 <div>
 <h2>Welcome to the Page page</h2>
 </div>
 );
};

export default Page;