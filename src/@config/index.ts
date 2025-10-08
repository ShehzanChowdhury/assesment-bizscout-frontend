/*
* Only global config should reside here
*/

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || API_BASE_URL;

export const DEFAULT_PAGE_SIZE = 10;