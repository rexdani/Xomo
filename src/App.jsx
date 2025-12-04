import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage  from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import AddressBook from "./pages/addressbook";
import CategoriesPage from "./pages/CategoriesPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import CollectionsPage from "./pages/CollectionsPage";
import ContactPage from "./pages/ContactPage";
import WishlistPage from "./pages/WishlistPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/address" element={<AddressBook/>}/>
        <Route path="/categories" element={<CategoriesPage/>}/>
        <Route path="/new-arrivals" element={<NewArrivalsPage/>}/>
        <Route path="/collections" element={<CollectionsPage/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
        <Route path="/wishlist" element={<WishlistPage/>}/>



      </Routes>
    </BrowserRouter>
  );
}

export default App;
