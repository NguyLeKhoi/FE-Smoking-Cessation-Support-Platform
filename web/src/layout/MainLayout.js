import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div>
      {showHeader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1100, // Ensure header is above other content, adjust as needed
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
          backdropFilter: 'blur(5px)', // Apply a blur effect
          WebkitBackdropFilter: 'blur(5px)', // For Safari support
        }}>
          <Header />
        </div>
      )}
      <main style={{ paddingTop: showHeader ? '64px' : 0 }}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
