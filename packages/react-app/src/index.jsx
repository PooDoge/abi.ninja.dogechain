import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { HashRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import App from "./App";
import "antd/dist/antd.css";
import "./styles/styles.less";

const themes = {
  dark: "",
  light: "",
};

const prevTheme = window.localStorage.getItem("theme");

ReactDOM.render(
  <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
    <HashRouter hashType="slash">
      <App />
    </HashRouter>
  </ThemeSwitcherProvider>,
  document.getElementById("root"),
);
