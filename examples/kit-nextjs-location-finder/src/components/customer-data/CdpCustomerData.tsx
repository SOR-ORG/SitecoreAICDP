import { RichText as ContentSdkRichText, Field } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { ComponentProps } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
type cdpCustomerDataBlockProps = ComponentProps & CdpCustomerDataFields;

interface CdpCustomerDataFields {
  fields: {
    text: Field<string>;
  };
}
export const Default: React.FC<cdpCustomerDataBlockProps> = (props) => {
  const { fields } = props;

  const text = props.fields ? (
    <ContentSdkRichText field={props.fields.text} />
  ) : (
    <span className="is-empty-hint">Rich text</span>
  );
  const id = props.params.RenderingIdentifier;
  if (fields) {
    return (
      <>
        <div
          className={cn('component cdpCustomerData', props.params.styles?.trimEnd())}
          id={id ? id : undefined}
        >
          <div className="component-content">{text}</div>
        </div>
      </>
    );
  }
  return <NoDataFallback componentName="Rich Text Block" />;
};