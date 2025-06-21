export async function login(identifier, password) {
  const res = await fetch("http://192.168.10.2:8000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },  
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Login failed");
  }

  const data = await res.json();
  localStorage.setItem("token", data.token); 
  localStorage.setItem("role", data.role);
  localStorage.setItem("is_approved",data.is_approved);

  return { token: data.token, role: data.role, username: data.username, is_approved: data.is_approved };
}
