import React from "react";
import { useParams } from "react-router";
import apiClient from "../service/apiClient";

export default function Verify() {
  const { token } = useParams();

  const verify = async () => {
    try {
      const data = apiClient.verify(token);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        className="p-2 bg-amber-200 rounded-xl text-black cursor-pointer"
        onClick={verify}
      >
        Click to verify
      </button>
    </div>
  );
}
