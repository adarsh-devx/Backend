import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useChat } from "../hooks/useChat";

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { initializeSocketConnection } = useChat();

    console.log(user);

    useEffect(() => {
        initializeSocketConnection();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 text-[#FFFFE3] p-8 font-sans">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Dashboard</h1>
            <p className="text-sm text-[#CBCBCB]">Welcome back, <span className="text-[#6D8196] font-semibold">{user?.username}</span>!</p>
        </div>
    )
}

export default Dashboard