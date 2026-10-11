"use client";

import { useState } from "react";

export default function ChoosePlan() {
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleContinue = () => {
    setShowConfirmation(true);
  };

  return (
    <div className="choose-plan">
      <section className="choose-plan__hero">
        <div className="choose-plan__header">
          <h1>Get unlimited access to many amazing books to read</h1>
          <p>
            Turn ordinary moments into extraordinary learning opportunities.
          </p>
        </div>

        <div className="choose-plan__hero-image">
          <img src="/pricing-top.png" alt="Premium learning illustration" />
        </div>
      </section>

      <div className="choose-plan__benefits">
        <div className="choose-plan__benefit">
          <span>📚</span>
          <h3>Read or listen anytime</h3>
          <p>Enjoy access to book summaries whenever you want.</p>
        </div>

        <div className="choose-plan__benefit">
          <span>🎧</span>
          <h3>Learn on the go</h3>
          <p>Listen to summaries while commuting, walking, or relaxing.</p>
        </div>

        <div className="choose-plan__benefit">
          <span>💡</span>
          <h3>Discover something new</h3>
          <p>Explore ideas and insights from a variety of books.</p>
        </div>
      </div>
      <div className="choose-plan__pricing">
        <h2>Choose the plan that's right for you</h2>

        <div className="choose-plan__plans">
          <div
            className={`choose-plan__plan ${
              selectedPlan === "yearly" ? "choose-plan__plan--active" : ""
            }`}
            onClick={() => {
              setSelectedPlan("yearly");
              setShowConfirmation(false);
            }}
          >
            <h3>Premium Plus Yearly</h3>
            <p className="choose-plan__price">$99.99/year</p>
            <p>7-day free trial</p>
          </div>

          <div
            className={`choose-plan__plan ${
              selectedPlan === "monthly" ? "choose-plan__plan--active" : ""
            }`}
            onClick={() => {
              setSelectedPlan("monthly");
              setShowConfirmation(false);
            }}
          >
            <h3>Premium Monthly</h3>
            <p className="choose-plan__price">$9.99/month</p>
            <p>Billed monthly</p>
          </div>
        </div>
        <button
          className="choose-plan__continue"
          type="button"
          onClick={handleContinue}
        >
          {selectedPlan === "yearly"
            ? "Start your 7-day free trial"
            : "Continue with Monthly"}
        </button>
        {showConfirmation && (
          <p className="choose-plan__confirmation" role="status">
            {selectedPlan === "yearly"
              ? "Yearly plan selected! Your 7-day free trial would begin here."
              : "Monthly plan selected! Your monthly subscription would begin here."}
          </p>
        )}
        <p className="choose-plan__disclaimer">
          Demo only — no payment will be collected.
        </p>
      </div>
      <section className="choose-plan__faq">
        <h2>Frequently Asked Questions</h2>

        <details>
          <summary>How does the free trial work?</summary>
          <p>
            The yearly plan includes a 7-day free trial. This demo does not
            activate a real subscription.
          </p>
        </details>

        <details>
          <summary>Can I cancel my subscription?</summary>
          <p>
            Real subscription cancellation would be handled through your account
            settings or payment provider.
          </p>
        </details>

        <details>
          <summary>What's included in Premium?</summary>
          <p>
            Premium is designed to provide unlimited access to book summaries in
            both reading and audio formats.
          </p>
        </details>

        <details>
          <summary>Can I switch between plans?</summary>
          <p>
            This demo lets you select monthly or yearly pricing. Changing an
            active subscription would require payment integration.
          </p>
        </details>
      </section>
      <footer className="choose-plan__footer">
        <div className="choose-plan__footer-content">
          <div className="choose-plan__footer-column">
            <h3>Actions</h3>
            <p>Summarist Magazine</p>
            <p>Cancel Subscription</p>
            <p>Help</p>
            <p>Contact us</p>
          </div>

          <div className="choose-plan__footer-column">
            <h3>Useful Links</h3>
            <p>Pricing</p>
            <p>Summarist Business</p>
            <p>Gift Cards</p>
            <p>Authors & Publishers</p>
          </div>

          <div className="choose-plan__footer-column">
            <h3>Company</h3>
            <p>About</p>
            <p>Careers</p>
            <p>Partners</p>
            <p>Code of Conduct</p>
          </div>

          <div className="choose-plan__footer-column">
            <h3>Other</h3>
            <p>Sitemap</p>
            <p>Legal Notice</p>
            <p>Terms of Service</p>
            <p>Privacy Policies</p>
          </div>
        </div>

        <p className="choose-plan__footer-copyright">
          Copyright © 2026 Summarist.
        </p>
      </footer>
    </div>
  );
}
