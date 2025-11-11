export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        
        {/* Logo & About */}
        <div>
          <div className="logo">Tripzy</div>
          <p style={{ marginTop: "8px", lineHeight: "1.5" }}>
            Your personal AI-powered travel companion — helping you plan smarter,
            explore deeper, and experience more without the stress.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4>Quick Links</h4>
          <a href="#">Home</a>
          <a href="#">Destinations</a>
          <a href="#">Hotels</a>
          <a href="#">Flights</a>
          <a href="#">Trip Planner</a>
        </div>

        {/* Support */}
        <div>
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">FAQs</a>
          <a href="#">Refund Policy</a>
          <a href="#">User Guide</a>
          <a href="#">Report an Issue</a>
        </div>

        {/* Contact / Address */}
        <div>
          <h4>Contact Us</h4>
          <p>📍 Hyderabad, Telangana, India - 500032</p>
          <p>✉️ support@tripzy.com</p>
          <p>☎️ +91 98765 43210</p>
          <p>🕒 Mon - Sat, 9:30am - 6:30pm IST</p>

          <div className="social" style={{ marginTop: "12px" }}>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bar">
        <span>© {new Date().getFullYear()} Tripzy. All rights reserved.</span>
        <div className="links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
