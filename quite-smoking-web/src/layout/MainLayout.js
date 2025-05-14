import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div>
      {showHeader && <Header />}
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
