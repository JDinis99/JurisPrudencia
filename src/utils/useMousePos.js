import React, { useState, useEffect } from "react";

export const useMousePos = () => {
  const [mousePos, setMousePos] = useState({});
  useEffect(() => {
    const getMousePos = e => {
      const posX = e.clientX;
      const posY = e.clientY;
      setMousePos({ posX, posY });
    };
    document.addEventListener("mousemove", getMousePos);
    return function cleanup() {
      document.removeEventListener("mousemove", getMousePos);
    };
  });
  return mousePos;
};
