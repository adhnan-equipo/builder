import React from "react";
import logo from "../../assets/logo/NVC_Equipo_LOGO.png";
import equipoLogo from "../../assets/logo/equipo-logo.svg";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100 flex items-center justify-center fixed inset-0 ">
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full animate-bounce"></div>
      <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-cyan-500/20 rounded-full animate-ping opacity-70"></div>
      <header className="absolute top-0 right-0 flex items-center justify-end w-full h-16 px-4">
        <Link to="/formBuilder">
          <img src={logo} alt="Logo" className="h-8 mr-4" />
        </Link>
        <img src={equipoLogo} alt="Equipo Logo" className="h-8" />
      </header>
      <div className="text-center space-y-6 max-w-2xl px-6 py-10 ">
        <h1
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent animate-pulse"
          onClick={() => (window.location.href = "/formList")}
        >
          Form builder
        </h1>
        <p className="text-blue-400 text-lg md:text-xl leading-relaxed tracking-wide">
          <a className="font-semibold">
            Powered by{" "}
            <a
              href="https://www.equipo.io/"
              target="_blank"
              className="text-blue-800"
              rel="noreferrer"
            >
              Equipo business solutions
            </a>
          </a>{" "}
        </p>
      </div>
      <footer className="absolute bottom-4 w-full text-center">
        <p className="text-xs text-gray-500">
          By using this service, you agree to our{" "}
          <a
            href="https://www.equipo.io/terms-and-conditions"
            target="_blank"
            className="text-blue-600 underline"
            rel="noreferrer"
          >
            Terms and Conditions
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default HomePage;

