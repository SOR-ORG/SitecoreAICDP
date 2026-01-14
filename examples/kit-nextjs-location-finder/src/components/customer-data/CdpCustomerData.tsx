'use client';

import React, { JSX, useEffect, useState } from 'react'
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { LayoutServicePageState, SitecoreProviderReactContext } from '@sitecore-content-sdk/nextjs';
import { guestDetailsResponse, getGuestDetails } from 'components/lib/datalayerhelper';
import { dateFormatter} from 'components/lib/utils'

interface Fields {
  Text: Field<string>;
}

export type CdpCustomertDataProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: CdpCustomertDataProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  const { page } = React.useContext(SitecoreProviderReactContext);
  const { pageState } = page.layout.sitecore.context;

  const [guestID, setGuestID] = useState<string | null>(pageState === LayoutServicePageState.Preview ? '123' : '<<Guest Ref>>');
  const [email, seEmail] = useState<string>(pageState === LayoutServicePageState.Preview ? 'joe.blogs@email.com' : '<<Email>>');
  const [accountNumber, setAccountNumber] = useState<string>(pageState === LayoutServicePageState.Preview ? '456' : '<<Account Number>>');
  const [customerName, setCustomerName] = useState<string>(pageState === LayoutServicePageState.Preview ? 'Joe Blogs' : '<<Customer Name>>');
  const [customerSince, setCustomerSince] = useState<string>(pageState === LayoutServicePageState.Preview ? '1 Jan 2000' : '<<Customer Since>>');


  useEffect(() => {
      (async () => {
        try {

          const response = await getGuestDetails () as guestDetailsResponse;

          if (response) {
            if (response.firstSeen) {


              if (response.firstName || response.lastName) {
                setCustomerName([response.firstName, response.lastName].filter(Boolean).join(' '));
              }

              setCustomerSince(response.firstSeen ? dateFormatter(response.firstSeen) : '');
              setGuestID(response.ref ? response.ref : '')

              
              for (let i = 0; i < response.identifiers.length; i++) {
                const identifier = response.identifiers[i];

                if(identifier?.provider && identifier.provider === 'email'){seEmail(identifier.id);}
                if(identifier?.provider && identifier.provider === 'accountNumber'){setAccountNumber(identifier.id);}

              }

            }
        }

        } catch (e) {
          console.error('Failed to get guest Data:', e);
        }
      })();
    }, []);

  return (
    <div className={`component CdpCustomerData ${styles}`} id={RenderingIdentifier}>

      <div className="component-content">

        {/* ===== Body copy from Sitecore (kept as-is) ===== */}
        {fields ? (
          <ContentSdkRichText field={fields.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}

        {/* ===== Summary Header Card (inline styled) ===== */}
        <section
          data-component="CustomerSummary"
          className="
            relative w-full overflow-hidden
            bg-[#0b0b0c] text-foreground
            border border-[#1f2022] rounded-xl
            px-4 py-4 sm:px-5 sm:py-5
            shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]
          "
        >
          {/* Top row: Name + AccountNumber */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-heading text-[1.05rem] sm:text-[1.15rem] font-semibold text-[#f2f3f5]">
              {customerName || 'Customer'}
            </h3>

            <h3 className="font-heading text-[1.05rem] sm:text-[1.15rem] font-semibold text-[#f2f3f5]">
              {accountNumber || 'accountNumber'}
            </h3>

          </div>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="inline-flex items-baseline gap-2">
              <span className="text-sm text-[#b5b8bc]">Customer Reference</span>
              <span className="text-sm text-[#e6e7e9]">{guestID ?? '— (client-only)'}</span>
            </div>

            {email && (
              <div className="inline-flex items-baseline gap-2">
                <span className="text-sm text-[#b5b8bc]">Email</span>
                <span className="text-sm text-[#e6e7e9]">{email}</span>
              </div>
            )}

            {customerSince && (
              <div className="inline-flex items-baseline gap-2">
                <span className="text-sm text-[#b5b8bc]">Customer Since</span>
                <span className="text-sm text-[#e6e7e9]">{customerSince}</span>
              </div>
            )}

          </div>

        </section>



      </div>

    </div>
  );
};





