import React, { JSX } from 'react';
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Text: Field<string>;
}

export type CdpContractDataProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: CdpContractDataProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  return (
    <div className={`component CdpContractData ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        {fields ? (
          <ContentSdkRichText field={fields.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}
      </div>
    </div>
  );
};
