import React, { useState, useCallback } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Simulate form submission
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(""), 3000);
    }, 1500);
  }, []);

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>

        <div className="contact-container">
          <div className="contact-info">
            <h3>Let's talk about your project</h3>
            <p>
              I'm currently available for freelance work. If you have a project
              that you want to get started, feel free to reach out.
            </p>

            <div className="contact-details">
              <div>
                <FaMapMarkerAlt />
                <div>
                  <h4>Location</h4>
                  <p>Pudukkottai, TN</p>
                </div>
              </div>
              <div>
                <FaPhone />
                <div>
                  <h4>Phone</h4>
                  <p>+91 9629419151</p>
                </div>
              </div>
              <div>
                <FaEnvelope />
                <div>
                  <h4>Email</h4>
                  <p>ishackmohamed028@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'success' && <p className="success-message">Message sent successfully!</p>}
          </form> */}
        </div>
      </div>
    </section>
  );
};

export default Contact;
