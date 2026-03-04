"use client";

import { loginUser } from "./login-action";

export default function Home() {
  const handleSubmit = async (formData: FormData) => {
    const res = await loginUser({
      username: formData.get("username") as string,
    });
    console.log("Result:", res);
  };
  return (
    <div style={{ fontFamily: "monospace", margin: "40px auto", maxWidth: 500 }}>
      <h1>next-safe-action bug repro</h1>
      <p>
        <strong>Bug:</strong> <code>returnValidationErrors</code> called from a
        middleware catch block throws instead of returning <code>validationErrors</code>{" "}
        when <code>handleServerError</code> is configured to rethrow.
      </p>
      <h2>Steps to reproduce</h2>
      <ol>
        <li>Enter username <code>taken</code></li>
        <li>Click Login</li>
        <li>
          <strong>Expected:</strong>{" "}
          <code>{`{ validationErrors: { _errors: ["Username is already taken"] } }`}</code>
        </li>
        <li>
          <strong>Actual:</strong> App crashes with &quot;Server Action server
          validation error(s) occurred&quot;
        </li>
      </ol>
      <hr />
      <form action={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Username:{" "}
            <input
              name="username"
              defaultValue="taken"
              style={{ border: "1px solid #ccc", padding: 4 }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: "6px 16px" }}>
          Login
        </button>
      </form>
    </div>
  );
}
