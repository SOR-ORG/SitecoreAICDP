'use client';

import React, { ChangeEvent, FormEvent, JSX, useState } from 'react';
import { Field, RichText as ContentSdkRichText, LinkField, Link } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { sendIdentityEvent } from 'components/lib/datalayerhelper';

interface Fields {
  Link: LinkField;
  Email: Field<string>;
}

export type loginProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

export const testLoginAccounts = [
  {
    email: 'brie.larson@gmail.com',
  },
  {
    email: 'scott.ryan@gmail.com',
  },
  {
    email: 'pedro.pascal@gmail.com',
  },
  {
    email: 'ivy.george@gmail.com',
  },
];

export const Default = ({ params, fields }: loginProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

   const emailText = fields ? (
    <ContentSdkRichText field={fields.Email} />
  ) : (
    <span className="is-empty-hint">Email :</span>
  );

  // State to store form input values
  const [formData, setFormData] = useState({ email: '' });

    // Event handler for form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Event handler for form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform any action you need with the form data (e.g., send it to a server)
    sendIdentityEvent(formData.email);
    console.log("loggedIn")
  };

  return (
    <section
      className={`component login ${styles ?? ''}`}
      id={RenderingIdentifier}
      aria-labelledby="loginTitle"
    >
      <div className="login-shell">
        <h1 id="loginTitle" className="login-title">
          Login
        </h1>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">
              {emailText}
            </label>

            <input
              list="emailList"
              type="email"
              id="email"
              name="email"
              className="login-input"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />

            <datalist id="emailList">
              {testLoginAccounts.map((item, index) => (
                <option value={item.email} key={index}></option>
              ))}
            </datalist>
          </div>

          {/* Submit */}
          <div className="login-submit-row">
            <button className="login-button" type="submit">
              <Link field={fields.Link} />
            </button>
          </div>
        </form>
      </div>

      {/* ---------- Styled-JSX: co-located CSS ---------- */}
      <style jsx>{`
        /* Dark section background (scoped to this component) */
        .component.login {
          background-color: #000;
          color: #fff;
        }

        /* Centered container with narrow width similar to mock */
        .login-shell {
          max-width: 720px;
          margin: 0 auto;
          padding: 56px 20px 96px;
        }

        /* Large, lightweight title, centered */
        .login-title {
          margin: 0 0 32px;
          font-size: clamp(32px, 6vw, 64px);
          font-weight: 400;
          line-height: 1.1;
          text-align: center;
          color: #fff;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .login-form-group {
          display: flex;
          flex-direction: column;
        }

        /* Label styling like the screenshot */
        .login-label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }

        /* Inputs: rounded, subtle border, dark fill */
        .login-input {
          width: 100%;
          appearance: none;
          background-color: #0b0b0b;
          border: 1.5px solid rgba(255, 255, 255, 0.28);
          color: #fff;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 16px;
          line-height: 1.3;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease,
            background-color 0.15s ease;
        }
        .login-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        .login-input:hover {
          border-color: rgba(255, 255, 255, 0.45);
        }
        .login-input:focus {
          border-color: #2b78ff;
          box-shadow: 0 0 0 3px rgba(43, 120, 255, 0.25);
          background-color: #0f0f0f;
        }

        /* Submit row to create breathing space before CTA */
        .login-submit-row {
          margin-top: 12px;
        }

        /* Primary CTA: full width blue button */
        .login-button {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          background-color: #1e74d9;
          color: #fff;
          border: 1px solid #1e74d9;
          border-radius: 10px;

          padding: 14px 18px;
          font-size: 16px;
          font-weight: 500;
          line-height: 1;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.03s ease,
            box-shadow 0.15s ease;
        }
        .login-button:hover {
          background-color: #2b78ff;
          border-color: #2b78ff;
        }
        .login-button:active {
          transform: translateY(1px);
        }
        .login-button:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(43, 120, 255, 0.35);
        }

        /* Subtle Chromium indicator color for datalist-enabled inputs */
        :global(input[list])::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.75;
        }

        /* Optional: hint style if Email field is empty in CMS */
        .is-empty-hint {
          opacity: 0.7;
        }
      `}</style>
    </section>
  );
};

