import React, { useState } from "react";
import apiClient from "../service/apiClient";
import { useNavigate } from "react-router";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    //   Make API Call
    try {
      console.log(`Trying to do singup`);
      const data = await apiClient.signup(name, email, password);
      console.log("Signup response: ", data);
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col justify-center w-screen h-screen">
      <h1 className="text-5xl text-zinc-200 mb-3">Welcome to Signe-Up Page</h1>
      <p className="text-zinc-700">Lorem ipsum dolor sit amet.</p>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center p-5 bg-zinc-700 flex-col rounded-3xl gap-3">
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="border-1 m-2 px-2 rounded-md border-zinc-800"
            />
          </div>
          <div>
            <label htmlFor="email">email:</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="border-1 m-2 px-2 rounded-md border-zinc-800"
            />
          </div>
          <div>
            <label htmlFor="password">Passowrd:</label>
            <input
              type="text"
              name="password"
              id="password"
              required
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="border-1 m-2 px-2 rounded-md border-zinc-800"
            />
          </div>
          <button
            className="px-3 bg-zinc-400 rounded-md text-black"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signup..." : "Signup"}
          </button>
        </div>
      </form>
      <h1>{name}</h1>
      <h1>{email}</h1>
      <h1>{password}</h1>
    </div>
  );
}
