import React, { useEffect } from 'react';
import './LegalPages.css';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-container">
      <h1>Terms of Service</h1>
      <div className="legal-last-updated">Last Updated: October 2024</div>

      <p>
        Welcome to SafeHaven. These terms and conditions outline the rules and regulations for the use of the SafeHaven Website.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing this website we assume you accept these terms and conditions. Do not continue to use SafeHaven if you do not agree to take all of the terms and conditions stated on this page.
      </p>

      <h2>2. User Accounts</h2>
      <p>
        If you create an account on the website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. We may, but have no obligation to, monitor and review new accounts before you may sign in and start using the Services.
      </p>

      <h2>3. User Content and Anonymity</h2>
      <p>
        SafeHaven allows users to post content anonymously. You agree not to use the platform to:
      </p>
      <ul>
        <li>Post content that is unlawful, defamatory, libelous, threatening, or harassing.</li>
        <li>Post content that infringes on any patent, trademark, trade secret, copyright, or other proprietary rights.</li>
        <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
        <li>Collect or store personal data about other users without their express consent.</li>
      </ul>
      <p>
        We reserve the right to remove any content that violates these guidelines or is otherwise objectionable.
      </p>

      <h2>4. Intellectual Property Rights</h2>
      <p>
        Other than the content you own, under these Terms, SafeHaven and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
      </p>

      <h2>5. Disclaimer of Warranties</h2>
      <p>
        This Website is provided "as is," with all faults, and SafeHaven expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you. SafeHaven does not offer professional medical, legal, or financial advice.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        In no event shall SafeHaven, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. SafeHaven, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
      </p>

      <h2>7. Variation of Terms</h2>
      <p>
        SafeHaven is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
      </p>

      <h2>8. Contact Information</h2>
      <p>
        If you have any questions or concerns regarding our Terms of Service, please contact us at support@safehaven.example.com.
      </p>
    </div>
  );
};

export default TermsOfService;
