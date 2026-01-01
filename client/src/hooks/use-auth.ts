import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { useLocation } from "wouter";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    setLocation("/admin/dashboard");
  };

  const logout = async () => {
    await signOut(auth);
    setLocation("/admin");
  };

  return { user, loading, login, logout };
}
