import React, { useContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
//import { initializeApp } from "firebase/app";

const AuthContext = React.createContext();

export function useAuth(){
    return useContext (AuthContext);
}

export function AuthProvider({children}){
    const [currentUser, setcurrentUser] = useState(null);
    const [userLoggedIn, setuserLoggedIn] = useState(false);
    const [loading, setLoading]= useState(true);

    useEffect(()=>{
        const unsub=onAuthStateChanged(auth, initializeUser)
        return unsub;
    },[])

    async function initializeUser(user){
        if(user){
            setcurrentUser({...user});
            setuserLoggedIn(true);
        }else{
            setcurrentUser(null);
            setuserLoggedIn(false);
        }
        setLoading(false)
    }
    const value={
        currentUser,
        userLoggedIn,
        loading
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading&& children}
        </AuthContext.Provider>
    )
}