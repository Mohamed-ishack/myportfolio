export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { username, password } = await req.json();

    const validUsername = Netlify.env.get("ADMIN_USERNAME") || "ishack";
    const validPassword = Netlify.env.get("ADMIN_PASSWORD") || "ishack123@#";

    if (username === validUsername && password === validPassword) {
      return new Response(JSON.stringify({ success: true, message: "Login successful" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: false, message: "Invalid username or password" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: "Bad request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/admin/login",
  method: "POST",
};
