"use client"

import { useEffect } from "react";

const Error = ({error, reset}:{error:Error & {digest?:string}; reset:() => void;}) => {
 useEffect(() => {
    //* We can pass this error to a logger
    console.error(error)
 }, [])
 return (
 <div>
   <h2>Something wen t Wrong : Please try again later </h2>
   <button onClick={() => reset()}> Retry</button>
 </div>
 );
};

export default Error;