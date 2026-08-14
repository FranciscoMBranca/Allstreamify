import { useEffect, useState } from "react";
import "./styles.css";
export default function LoginSignupForm() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!document.getElementById("lsf-fonts")) {
      const fontLink = document.createElement("link");
      fontLink.id = "lsf-fonts";
      fontLink.rel = "stylesheet";
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap";
      document.head.appendChild(fontLink);
    }
    if (!document.getElementById("lsf-boxicons")) {
      const iconLink = document.createElement("link");
      iconLink.id = "lsf-boxicons";
      iconLink.rel = "stylesheet";
      iconLink.href = "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";
      document.head.appendChild(iconLink);
    }
  }, []);

  const handleSubmit = (e) => e.preventDefault();

  return (
    <div className="lsf-wrapper">
      <style>{CSS}</style>
      <div className={`lsf-container${active ? " active" : ""}`}>
        <div className="lsf-form-box lsf-login">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="lsf-input-box">
              <input type="text" placeholder="Username" required />
              <i className="bx bxs-user"></i>
            </div>
            <div className="lsf-input-box">
              <input type="password" placeholder="Password" required />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className="lsf-forgot-link">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="lsf-btn">Login</button>
            <p>or login with social platforms</p>
            <div className="lsf-social-icons">
              <a href="#"><i className="bx bxl-google"></i></a>
              <a href="#"><i className="bx bxl-facebook"></i></a>
              <a href="#"><i className="bx bxl-github"></i></a>
              <a href="#"><i className="bx bxl-linkedin"></i></a>
            </div>
          </form>
        </div>

        <div className="lsf-form-box lsf-register">
          <form onSubmit={handleSubmit}>
            <h1>Registration</h1>
            <div className="lsf-input-box">
              <input type="text" placeholder="Username" required />
              <i className="bx bxs-user"></i>
            </div>
            <div className="lsf-input-box">
              <input type="email" placeholder="Email" required />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="lsf-input-box">
              <input type="password" placeholder="Password" required />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" className="lsf-btn">Register</button>
            <p>or register with social platforms</p>
            <div className="lsf-social-icons">
              <a href="#"><i className="bx bxl-google"></i></a>
              <a href="#"><i className="bx bxl-facebook"></i></a>
              <a href="#"><i className="bx bxl-github"></i></a>
              <a href="#"><i className="bx bxl-linkedin"></i></a>
            </div>
          </form>
        </div>

        <div className="lsf-toggle-box">
          <div className="lsf-toggle-panel lsf-toggle-left">
            <h1>Olá!, Bem-vindo!</h1>
            <p>Não tem uma conta?</p>
            <button className="lsf-btn lsf-register-btn" onClick={() => setActive(true)}>
              Register
            </button>
          </div>

          <div className="lsf-toggle-panel lsf-toggle-right">
            <h1>Olá novamente!</h1>
            <p>Already have an account?</p>
            <button className="lsf-btn lsf-login-btn" onClick={() => setActive(false)}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
