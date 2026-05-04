import React, { useEffect } from 'react';
import './LegalPages.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-container">
      <h1>Privacy Policy</h1>
      <div className="legal-last-updated">Last Updated: October 2024</div>

      <p>
        At SafeHaven, accessible from our platform, one of our main priorities is the privacy of our visitors. 
        This Privacy Policy document contains types of information that is collected and recorded by SafeHaven and how we use it.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect information to provide better services to all our users. The types of personal information we collect include:
      </p>
      <ul>
        <li><strong>Account Information:</strong> When you register using an email or Google OAuth, we collect your name, email address, and avatar.</li>
        <li><strong>User Content:</strong> Any posts, advice, or content you share anonymously or publicly on the platform.</li>
        <li><strong>Usage Data:</strong> We may collect data on how you interact with our platform to improve user experience.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect in various ways, including to:</p>
      <ul>
        <li>Provide, operate, and maintain our platform.</li>
        <li>Improve, personalize, and expand our platform.</li>
        <li>Understand and analyze how you use our platform.</li>
        <li>Develop new products, services, features, and functionality.</li>
        <li>Find and prevent fraud or abusive behavior.</li>
      </ul>

      <h2>3. Anonymity and Public Display</h2>
      <p>
        SafeHaven is designed as an anonymous platform. While we store your account details securely to manage your login state, 
        your posts are displayed completely anonymously to the public unless you explicitly choose to reveal your identity.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>
        We use third-party services like Google Identity Services for authentication. These third parties have their own privacy policies 
        addressing how they use such information.
      </p>

      <h2>5. Security of Your Information</h2>
      <p>
        We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. 
        However, no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
      </p>

      <h2>6. Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. 
        We will notify you of any changes by posting the new Privacy Policy on this page.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@safehaven.example.com.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
