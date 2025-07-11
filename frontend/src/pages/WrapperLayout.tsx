import { Outlet, Link } from "react-router-dom";
import eaLogo from "../assets/ea-logo.svg";
import bgImage from "../assets/ea-bg.png";
import "../index.css";

export default function WrapperLayout() {
  return (
    <div className="wrapper-container">
      <div className="left-panel">
        <Link to="/" style={{ alignSelf: "flex-start" }}>
          <img src={eaLogo} alt="EA Logo" className="logo" />
        </Link>
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
