import { Link, Navigate , useNavigate} from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";



export default function Login(){
    const {userLoggedIn} = useAuth();

    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password,setPassword] =useState('')
    const [isSigningIn,setIsSigningIn]=useState(false)
    const [errorMessage,setErrorMessage]=useState('')

    const onSubmit = async (e) => {
        e.preventDefault();
        if(!isSigningIn){
            setIsSigningIn(true)
            setErrorMessage(""); 
            try {
            await doSignInWithEmailAndPassword(email,password);
            } catch(err) {
                setErrorMessage(err.message);
                setIsSigningIn(false);
            }
        }
    };
    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if(!isSigningIn){
            setIsSigningIn(true)
            setErrorMessage("");
            try {
                await doSignInWithGoogle();
            } catch(err) {
                setErrorMessage(err.message);
                setIsSigningIn(false);
            }
        }
    };




    return(
        <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
             {userLoggedIn && ( <Navigate to={'/app'} replace={true}  />)}
            <div className="bg-[#1a1a1a] p-8 rounded-xl shadow-lg w-full max-w-md">

                <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                        {errorMessage}
                    </div>
                )}

                <form action="" className="space-y-4" onSubmit={onSubmit}>
                    <input type="email" placeholder="Email"
                        className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg 
                                focus:outline-none focus:border-[#4C82FB] text-white"
                        value={email} onChange={e => setEmail(e.target.value)} />

                    <input type="password" placeholder="password" 
                        className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg 
                                focus:outline-none focus:border-[#4C82FB] text-white"
                        value={password} onChange={e => setPassword(e.target.value)}/>

                    <button type="submit"
                        disabled={isSigningIn}
                        className="w-full py-3 bg-[#4C82FB] text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50">
                        {isSigningIn ? "Signing In..." : "Login"}
                    </button>
                </form>
                <button className="w-full mt-4 py-3 border border-[#4C82FB] text-[#4C82FB] 
                font-semibold rounded-lg hover:bg-[#4C82FB] hover:text-white transition"
                onClick={onGoogleSignIn}>
                    {isSigningIn ? "Signing In..." : "Continue with Google"}
                </button>

                <div className="mt-4 flex justify-center">
                    <p className="mt-6 text-gray-400 text-sm text-center">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-[#4C82FB] hover:underline">
                            Sign up
                        </Link>
                    </p>
                
                </div>
                <p className="mt-4 text-sm text-gray-500 text-center">
                    <Link to="/" className="pr-6">Back to Home</Link>

                    
                </p>
            </div>
            
        </div>
   
    )
}