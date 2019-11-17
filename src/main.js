import React, { useState } from "react";
import ReactDOM from "react-dom";

import SvelteCropper from "svelte-easy-crop";
import toReact from "svelte-adapter/react";

const Cropper = toReact(SvelteCropper, {}, "div");
let image =
	"https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2776&q=80";

const buttons = {
	position: "absolute",
	left: 0,
	right: 0,
	bottom: "10px"
};

function App() {
	const [showCropper, toggleShow] = useState(false);
	const [data, setData] = useState({});
	const [zoom, setZoom] = useState(1);

	const zoomIn = () => setZoom(z => (z >= 3 ? 3 : Math.floor(z) + 1));
	const zoomOut = () => setZoom(z => (z <= 1 ? 1 : Math.ceil(z) - 1));
	const updateData = ({ detail }) => setData(detail);

	return (
		<div className="App">
			<button onClick={() => toggleShow(bool => !bool)}>Show Cropper</button>
			<div className="data">
				Data: <pre>{JSON.stringify(data, null, 2)}</pre>
				Zoom Level: <pre>{JSON.stringify(zoom, null, 2)}</pre>
			</div>
			{showCropper ? (
				<>
					<Cropper
						onCropcomplete={updateData}
						watchZoom={z => setZoom(z)}
						image={image}
						zoom={zoom}
					/>
					<div style={buttons}>
						<button onClick={() => toggleShow(bool => !bool)}>
							Close Cropper
						</button>
						<button onClick={zoomIn}>+</button>
						<button onClick={zoomOut}>-</button>
					</div>
				</>
			) : null}
		</div>
	);
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
