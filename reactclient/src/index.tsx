import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

let isLoggedIn: boolean = (window as any).isLoggedIn;
ReactDOM.render(
    <Hello isLoggedIn={isLoggedIn} />,
    document.getElementById("example")
);