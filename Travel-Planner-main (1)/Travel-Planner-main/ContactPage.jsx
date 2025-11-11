import { useState } from "react";
import "./style.css";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Contact Form Submitted →", form);
    alert("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="contact-wrap">
      {/* Hero Section */}
      <section className="contact-hero">
        <h1>Let’s Talk ✉️</h1>
        <p>Your journey starts with a hello. We’re here to help.</p>
      </section>

      {/* Contact + Form Section */}
      <section className="contact-content container">
        <div className="contact-left">
          <h2>Contact Info</h2>
          <p className="muted">Reach us anytime. We reply within 24 hours.</p>

          <div className="contact-item">📍 Hyderabad, Telangana, India</div>
          <div className="contact-item">📞 +91 98765 43210</div>
          <div className="contact-item">✉️ support@tripzy.app</div>
          <div className="contact-item">🌐 www.tripzy.app</div>

          <iframe
            title="Tripzy Office"
            className="contact-map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.506805553969!2d78.38240487488735!3d17.43764300254459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93e0e8c13bbb%3A0x8281df445cb2f4f2!2sHyderabad!5e0!3m2!1sen!2sin!4v1700000000000"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send us a message</h2>

          <input
            type="text"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Your Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <textarea
            placeholder="Your Message"
            rows="5"
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          ></textarea>

          <button type="submit" className="contact-btn">Send Message</button>
        </form>
      </section>
    </div>
  );
}
