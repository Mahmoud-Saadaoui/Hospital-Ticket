import { useCallback, useEffect, useState } from "react";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "system";
  }

  const savedTheme = window.localStorage.getItem("theme");
  return savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : "system";
};

const useTheme = () => {
  const [theme, setThemeState] = useState(getInitialTheme);

  const setTheme = useCallback((nextTheme) => {
    if (["light", "dark", "system"].includes(nextTheme)) {
      setThemeState(nextTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const shouldUseDark =
        theme === "dark" || (theme === "system" && darkQuery.matches);

      root.classList.toggle("dark", shouldUseDark);
    };

    if (theme === "system") {
      window.localStorage.removeItem("theme");
    } else {
      window.localStorage.setItem("theme", theme);
    }

    applyTheme();

    const changeHandler = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    darkQuery.addEventListener?.("change", changeHandler);
    darkQuery.addListener?.(changeHandler);

    return () => {
      darkQuery.removeEventListener?.("change", changeHandler);
      darkQuery.removeListener?.(changeHandler);
    };
  }, [theme]);

  return { theme, setTheme, toggleTheme };
};

export default useTheme;
