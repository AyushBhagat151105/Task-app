import React, { useEffect, useState } from "react";
import apiClient from "../service/apiClient";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient.dashboard();
        console.log(data);
        setRole(data.data.role);
        setName(data.data.name);
        setEmail(data.data.email);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const logout = async () => {
    try {
      const data = await apiClient.logout();
      if (data.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-4xl">Deshbord</h1>
      <p>{role}</p>
      <p>{name}</p>
      <p>{email}</p>

      <button
        className="p-2 bg-amber-300 rounded-xl text-black"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
