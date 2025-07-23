import AdminPage from "./AdminProductForm";
import { useProducts } from "../context/ProductContext"; // import this

function App() {
  const { addProduct } = useProducts(); // inside the component

  return (
    <div>
      <AdminPage />
     
    </div>
  );
}

export default App;
