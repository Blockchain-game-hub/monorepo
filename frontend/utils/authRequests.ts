import jwt from "jsonwebtoken";
import { LS_KEY } from "../context/wallet";
const verifyRequest = async (
  address: string,
  signature: string,
  nonce: string,
  setAuth
) => {
  const response = await fetch(
    `/api/auth/verify?address=${address}&signature=${signature}&nonce=${nonce}`
  );
  const data = await response.json();
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  setAuth(data);
};

export const authRequest = async (address: string, signer, setAuth) => {
  const response = await fetch(`/api/auth?address=${address}`);
  const data = await response.json();
  const signature = await signer.signMessage(`${data.nonce}`);
  verifyRequest(address, signature, data.nonce, setAuth);
};
