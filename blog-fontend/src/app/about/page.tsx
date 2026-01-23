

export const dynamic = "force-dynamic"; 

const Page = async () => {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    // throw new Error("Something went wrong")
 return (
 <div>
 <h2>Welcome to the Page page about</h2>
 </div>
 );
};

export default Page;