'use client';

import React, { JSX, useEffect, useState } from 'react'
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Text: Field<string>;
}

export type CdpCustomerDataProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: CdpCustomerDataProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;
   const [guestID, setGuestID] = useState<string | null>(null);

  useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          const mod = await import('@sitecore-cloudsdk/core/browser');
          const id = await mod.getGuestId(); // Promise<string | undefined>
          if (mounted) setGuestID(id ?? null);
        } catch (e) {
          console.error('Failed to get guest ID:', e);
        }
      })();
      return () => {
        mounted = false;
      };
    }, []);

  return (
    <div className={`component CdpCustomerData ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        {fields ? (
          <ContentSdkRichText field={fields.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}
        <span>Customer data guestID: {guestID ?? '— (client-only)'}</span>
      </div>
    </div>
  );
};





