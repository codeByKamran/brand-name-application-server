export const statusCodes = {
  AVAILABLE: [404, 403, 301], // Not Found - Forbidden - Moved Permanently
  UNAVAILABLE: [200],
};

/* r.status_code >= 300 or r.status_code < 200 */ // StATUS cODE MUST BE IN 2XX RANGE
