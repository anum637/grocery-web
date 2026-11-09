import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import CreateSubscription from "./pages/CreateSubscription";
import MySubscriptions from "./pages/MySubscriptions";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  return (
    <SubscriptionProvider>
      <BrowserRouter>
        <nav style={{display:"flex", gap:20, padding:16, background:"#111", color:"#fff"}}>
          <b>🥦 DailyFresh</b>
          <Link to="/" style={{color:"#fff"}}>Subscribe</Link>
          <Link to="/my" style={{color:"#fff"}}>My Dashboard</Link>
          <Link to="/admin" style={{color:"#fff"}}>Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<CreateSubscription/>} />
          <Route path="/my" element={<MySubscriptions/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
        </Routes>
      </BrowserRouter>
    </SubscriptionProvider>
  );
}
export default App;