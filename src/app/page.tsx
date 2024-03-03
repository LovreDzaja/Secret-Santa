'use client'
import { useEffect, useState } from "react";
import AddUser from "./components/AddUser";
import Loading from "./loaders/Loading";

export default function Home() {
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setTimeout(()=>setLoading(true), 3000);
  }, [])

  return (
    <main className="h-screen x-screen flex justify-center items-center">
        {!loading ? (
          <Loading/>
        ):(
          <AddUser/>
        )}

    </main>
  );
}