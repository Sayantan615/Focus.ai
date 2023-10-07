import "./App.css";
import { useState } from "react";

const Loginpage = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const handleSubmission = () => {
    // Search data base for email and password
  }
  return (
    <>
      <div className="container">
        <h1>Login Page</h1>
        <form onSubmit={handleSubmission}>

        <input
          type="text"
          placeholder="User Name"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <button className="btn" type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Loginpage;
