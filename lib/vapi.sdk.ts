import Vapi from "@vapi-ai/web";

const vapiToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

if (!vapiToken) {
  console.error("VAPI Web Token is not configured. Please check your environment variables.");
}

export const vapi = new Vapi(vapiToken || "");