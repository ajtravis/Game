import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { ModalProvider, Modal } from "./context/Modal";
import configureStore from "./store";
import * as sessionActions from "./store/session";
import App from "./App";

import { TowerContext } from "./context/TowerContext";

import "./index.css";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
	window.store = store;
	window.sessionActions = sessionActions;
}


function Root() {
	return (
		<ModalProvider>
			{/* <TowerContext.Provider value={{}}> */}
				<Provider store={store}>
					<BrowserRouter>
						<App />
						<Modal />
					</BrowserRouter>
				</Provider>
			{/* </TowerContext.Provider> */}
		</ModalProvider>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Root />
	</React.StrictMode>,
	document.getElementById("root")
);