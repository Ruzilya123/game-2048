import React from "react";
import { IScoreboard } from "../types";

const Scoreboard: React.FC<IScoreboard> = ({ score }) => {
    return <h2>Score: {score}</h2>;
};

export default Scoreboard;
