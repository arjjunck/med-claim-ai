const API_BASE_URL = "http://localhost:5283/api";

export type AuthResponse = {
  token: string;
  email: string;
  fullName: string;
};

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/Auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password.");
  }

  return (await response.json()) as AuthResponse;
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string
) {
  const response = await fetch(`${API_BASE_URL}/Auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullName, email, password }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Registration failed.");
  }

  return (await response.json()) as AuthResponse;
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/Auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch current user.");
  }

  return await response.json();
}