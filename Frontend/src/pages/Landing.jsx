import { Link } from "react-router-dom";

export default function Landing(){
    return(
        <>
            <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#121212] flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white">Smart Assistant for <span className="text-blue-400">Research Summarization</span></h1>
                <p className="mt-4 text-gray-400 text-lg max-w-2xl">A GenAI - powered tool with RAG</p>
                <Link to="/login">
                    <button className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg transition">Get Started</button>
                </Link>
            </div>
        </>
    )
}