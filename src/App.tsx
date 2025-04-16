import { Route, Routes } from "react-router";

import RootLayout from "./_root/RootLayout";
import HomePage from "./_root/homePage/HomePage";
import FormBuilder from "./components/form-builder";
import { FormList } from "./components/shared/FormList";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/formBuilder" element={<FormBuilder />} />
        <Route path="/formList" element={<FormList />} />
      </Route>
    </Routes>
  );
}

export default App;
