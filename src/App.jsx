import AppRouter from "./routers/AppRouter";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Slick Carousel (Estilos del slider)
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Animaciones AOS
import 'aos/dist/aos.css';

const App = () => {
  return <AppRouter />;
};

export default App;