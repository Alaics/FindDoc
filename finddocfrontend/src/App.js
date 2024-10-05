import "./App.css";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeScreen from "./components/screens/HomeScreen";
import DoctorScreen from "./components/screens/DoctorScreen";
import ProductScreen from "./components/screens/ProductScreen";
import CartScreen from "./components/screens/CartScreen";
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import ShippingScreen from './components/screens/ShippingScreen';
import PaymentScreen from './components/screens/PaymentScreen';
import PlaceOrderScreen from './components/screens/PlaceOrderScreen';
import OrderScreen from './components/screens/OrderScreen';
import OrderListScreen from './components/screens/OrderListScreen';
import ProductListScreen from './components/screens/ProductListScreen';
import ProductEditScreen from './components/screens/ProductEditScreen';
import UserListScreen from './components/screens/UserListScreen'
import UserEditScreen from './components/screens/UserEditScreen'
import ProfileScreen from './components/screens/ProfileScreen'
import AllProductScreen from "./components/screens/AllProductScreen";
import BookScreen from "./components/screens/BookScreen"
function App() {
  
  return (
<Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/" component={HomeScreen} exact />
          <Route path="/doctor/:id" component={DoctorScreen} />
          <Route path="/book/:id?" component={BookScreen} exact />

          <Route path="/allproduct" component={AllProductScreen} exact />
          <Route path="/login" component={LoginScreen} exact />
          <Route path="/register" component={RegisterScreen} exact />
          <Route path="/product/:id" component={ProductScreen} exact />
          <Route path="/cart/:id?" component={CartScreen} exact />
          <Route path='/shipping' component={ShippingScreen} />
          <Route path='/payment' component={PaymentScreen} />
          <Route path='/placeorder' component={PlaceOrderScreen} />
          <Route path='/order/:id' component={OrderScreen} />
          
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/admin/userlist' component={UserListScreen} />
          <Route path='/admin/user/:id/edit' component={UserEditScreen} />
          <Route path='/admin/productlist' component={ProductListScreen} />
          <Route path='/admin/product/:id/edit' component={ProductEditScreen} />
          <Route path='/admin/orderlist' component={OrderListScreen} />

        </Container>
      </main>

      <Footer />
      </Router>
  );
}

export default App;