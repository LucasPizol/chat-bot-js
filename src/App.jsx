import { useEffect, useState } from "react";
import "./App.css";
import * as firestore from "firebase/firestore";
import { db } from "./firebase";
import Main from "./pages/Main/Main";
import RoutesApp from "./routes";
import { BrowserRouter } from "react-router-dom";

const getDataBase = async () => {
  const reference = firestore.collection(db, "Users");
  const usersCollection = await firestore.getDocs(reference);
  const usersArray = usersCollection.docs.map((item) => item.data());

  return usersArray;
};

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getDataBase().then((usersArray) => {
      setUsers(usersArray);
    });
  }, []);

  return (
    <BrowserRouter>
      <RoutesApp users={users} />
    </BrowserRouter>
  );
}

export default App;
