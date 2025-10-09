import { ResponseData } from "@/types";

type IncomingResponse = Partial<ResponseData> & { id?: string };

export function normalizeResponse(incoming: IncomingResponse): ResponseData | null {
  const _id = incoming?._id ?? incoming?.id;
  
  if (!_id || !incoming.timestamp || !incoming.response) {
    return null;
  }
  
  return {
    _id,
    timestamp: incoming.timestamp,
    requestPayload: incoming.requestPayload ?? {},
    response: incoming.response,
    error: incoming.error,
    createdAt: incoming.createdAt ?? new Date().toISOString(),
    updatedAt: incoming.updatedAt ?? new Date().toISOString(),
  };
}