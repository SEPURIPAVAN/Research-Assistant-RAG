import { Link, Navigate, useNavigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Signup() {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        
        if (!isRegistering) {
            setIsRegistering(true);
            setErrorMessage("");
            
            try {
                await doCreateUserWithEmailAndPassword(email, password);
                navigate("/app");
            } catch (err) {
                setErrorMessage(err.message);
                setIsRegistering(false);
            }
        }
    };

    const onGoogleSignUp = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            try {
                await doSignInWithGoogle();
                navigate("/app");
            } catch (err) {
                setErrorMessage(err.message);
                setIsRegistering(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
            {userLoggedIn && <Navigate to={'/app'} replace={true} />}
            
            <div className="bg-[#1a1a1a] p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                        {errorMessage}
                    </div>
                )}

                <form className="space-y-4" onSubmit={onSubmit}>
                    <input
                        type="email" placeholder="Email"
                        required value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg 
                                focus:outline-none focus:border-[#4C82FB] text-white"
                        disabled={isRegistering} />

                    <input
                        type="password" placeholder="Password" required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg 
                                focus:outline-none focus:border-[#4C82FB] text-white"
                        disabled={isRegistering}/>

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg 
                                focus:outline-none focus:border-[#4C82FB] text-white"
                        disabled={isRegistering}/>

                    <button
                        type="submit"
                        disabled={isRegistering}
                        className="w-full py-3 bg-[#4C82FB] text-white font-semibold rounded-lg 
                                hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {isRegistering ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <button
                    onClick={onGoogleSignUp}
                    disabled={isRegistering}
                    className="w-full mt-4 py-3 border border-[#4C82FB] text-[#4C82FB] 
                            font-semibold rounded-lg hover:bg-[#4C82FB] hover:text-white transition
                            disabled:opacity-50 disabled:cursor-not-allowed">
                    Continue with Google
                </button>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-gray-400 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#4C82FB] hover:underline">
                            Sign in
                        </Link>
                    </p>
                    <p className="text-sm text-gray-500">
                        <Link to="/" className="hover:text-gray-300">Back to Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}