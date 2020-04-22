import Input from "input";
import React, { useState } from "react";


function App() {
	const [v, vv] = useState("");
	return <Input mask="currency" onChange={(e) => vv(e.target.value)} value={v} />;
}

export default App;
