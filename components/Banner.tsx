const Banner: React.FC = () => {
  return (
    <div className="tinotech-banner">
      <a
        href="https://tinotech.co.za"
        target="_blank"
        rel="noopener noreferrer"
        className="banner-link"
      >
        <div className="banner-content">
          <span className="powered-by">powered by</span>
          <div className="logo-container">
            <img src="/tinotech Dark Blue Text.png" alt="tinotech Logo" />
          </div>
        </div>
      </a>
    </div>
  );
};

export default Banner;
