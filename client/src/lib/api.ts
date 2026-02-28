const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export type ApiError = { message: string };

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": opts.body instanceof FormData ? undefined : "application/json",
      ...(opts.headers || {})
    } as any
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data && data.message) ? data.message : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export { API_URL, request };
