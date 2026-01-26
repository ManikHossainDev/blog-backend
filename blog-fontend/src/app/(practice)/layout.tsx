import Link from "next/link";
import { ReactNode } from "react";

const PracticeLayout = ({
    children,
    marketingSlot,
    salesSlot,
}:{
    children:ReactNode,
    marketingSlot:ReactNode,
    salesSlot:ReactNode
}) => {
 return (
 <div className="p-4">
    <nav className="flex gap-4 mb-6 flex-wrap">
        <Link className="px-3 py-2  " href="/development">Development</Link>
        <Link className="px-3 py-2  " href="/testing">Testing</Link>
        <Link className="px-3 py-2  " href="/marketing">Marketing</Link>
        <Link className="px-3 py-2  " href="/marketing/settings">Marketing Settings</Link>
        <Link className="px-3 py-2  " href="/sales">Sales</Link>
    </nav>

    <div className="">
     <div className="flex">
       {marketingSlot}
       {salesSlot}
     </div>

     
       {children}
    </div>
 </div>
 );
};

export default PracticeLayout;