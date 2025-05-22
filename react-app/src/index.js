import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useContext } from "react";
import { ModalProvider, Modal } from "./context/Modal";
import configureStore from "./store";
import * as sessionActions from "./store/session";
import App from "./App";

import { TowerContext, TowerProvider } from "./context/TowerContext";

import "./index.css";


const store = configureStore();

if (process.env.NODE_ENV !== "production") {
	window.store = store;
	window.sessionActions = sessionActions;
}



function Root() {
	
	return (
		<ModalProvider>
			 <TowerProvider value={{towerType: "basic"}}>
				<Provider store={store}>
					<BrowserRouter>
						<App />
						<Modal />
					</BrowserRouter>
				</Provider>
			 </TowerProvider>
		</ModalProvider>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Root />
	</React.StrictMode>,
	document.getElementById("root")
);