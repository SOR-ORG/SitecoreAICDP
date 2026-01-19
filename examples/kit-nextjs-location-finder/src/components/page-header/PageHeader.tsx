'use client';
import type React from 'react';
import type { PageHeaderProps } from './page-header.props';
import { PageHeaderDefault } from './PageHeaderDefault.dev';
import { PageHeaderGreenText } from './PageHeaderGreenText.dev';
import { PageHeaderFiftyFifty } from './PageHeaderFiftyFifty.dev';
import { PageHeaderGreenBackground } from './PageHeaderGreenBackground.dev';
import { PageHeaderCentered } from './PageHeaderCentered.dev';

/* 
  This component is a page header with multiple variants:
  - Default: Shows the header as per the provided design
  - GreenText: Modified version with green text styling (to be implemented)
  - 50-50: Equal width layout for the left and right content (to be implemented)
*/

// Default display of the component
export const Default: React.FC<PageHeaderProps> = (props) => {
  const { isEditing } = props.page.mode;
  return <PageHeaderDefault {...props} isPageEditing={isEditing} />;
};

// Variants
export const GreenText: React.FC<PageHeaderProps> = (props) => {
  const { isEditing } = props.page.mode;
  return <PageHeaderGreenText {...props} isPageEditing={isEditing} />;
};

export const FiftyFifty: React.FC<PageHeaderProps> = (props) => {
  const { isEditing } = props.page.mode;
  return <PageHeaderFiftyFifty {...props} isPageEditing={isEditing} />;
};

export const GreenBackground: React.FC<PageHeaderProps> = (props) => {
  const { isEditing } = props.page.mode;
  return <PageHeaderGreenBackground {...props} isPageEditing={isEditing} />;
};

export const Centered: React.FC<PageHeaderProps> = (props) => {
  const { isEditing } = props.page.mode;
  return <PageHeaderCentered {...props} isPageEditing={isEditing} />;
};
