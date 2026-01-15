'use client';

import React, { ChangeEvent, FormEvent, JSX, useState } from 'react';
import { Field, RichText as ContentSdkRichText, LinkField, Link } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

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
    console.log("loggedIn")
  };

  return (
    <div className={`component login ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <div className="login-email">
                <label htmlFor="email">{emailText} </label>
                <input
                  list="emailList"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <datalist id="emailList">
                {testLoginAccounts.map((item, index) => (
                  <option value={item.email} key={index}></option>
                ))}
              </datalist>
            </div>
            <div className="login-form-group">
              <button className="login-button" type="submit">
                <Link field={fields.Link} />
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};


