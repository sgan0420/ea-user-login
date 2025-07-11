import { Outlet } from "react-router-dom";
import eaLogo from "../assets/ea-logo.svg";
import bgImage from "../assets/ea-bg.png";
import "../index.css";

export default function WrapperLayout() {
  return (
    <div className="wrapper-container">
      <div className="left-panel">
        <img src={eaLogo} alt="EA Logo" className="logo" />
        <div className="left-panel-content">
          <Outlet />
        </div>
      </div>
      <div
        className="right-panel"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
    </div>
  );
}
