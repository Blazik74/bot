import React from "react";
import { useThemeContext } from "../../contexts/ThemeContext";
import "./BottomNavigation.css";

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const { theme } = useThemeContext();

  return (
    <nav className={`bottom-navigation bottom-navigation--${theme}`}>
      <button
        className={`bottom-navigation__tab${activeTab === "main" ? " active" : ""}`}
        onClick={() => onTabChange("main")}
      >
        Главная
      </button>
      <button
        className={`bottom-navigation__tab${activeTab === "ai" ? " active" : ""}`}
        onClick={() => onTabChange("ai")}
      >
        ИИ Таргетолог
      </button>
      <button
        className={`bottom-navigation__tab${activeTab === "profile" ? " active" : ""}`}
        onClick={() => onTabChange("profile")}
      >
        Профиль
      </button>
      <button
        className={`bottom-navigation__tab${activeTab === "tariffs" ? " active" : ""}`}
        onClick={() => onTabChange("tariffs")}
      >
        Тарифы
      </button>
    </nav>
  );
};

export default BottomNavigation; 
