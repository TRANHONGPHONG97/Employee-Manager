import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ContactList from "./components/ContactList/ContactList";
import AddContact from "./components/AddContact/AddContact";
import ViewContact from "./components/ViewContact/ViewContact";
import EditContact from "./components/EditContact/EditContact";
import Location from "./components/Navbar/Location";

function App() {
  return (
    <>
      <ToastContainer autoClose={2000} />
      <Navbar />
      <Routes>
        <Route path="/cg-contact" element={<ContactList />} />
        <Route path="/cg-contact/contact/list" element={<ContactList />} />
        <Route path="/cg-contact/contact/add" element={<AddContact />} />
        <Route
          path="/cg-contact/contact/view/:contactId"
          element={<ViewContact />}
        />
        <Route
          path="/cg-contact/contact/edit/:contactId"
          element={<EditContact />}
        />
        <Route path="/cg-contact/location" element={<Location />}></Route>
      </Routes>
    </>
  );
}

export default App;
