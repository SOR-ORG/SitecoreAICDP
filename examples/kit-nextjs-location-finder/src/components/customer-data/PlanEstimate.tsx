'use client';

import React from 'react'
import { useTranslations } from 'next-intl';
import { PlanEstimateDataProps, PlanEstimateDefault } from './PlanEstimateDefault';
import { PlanEstimateForm } from './PlanEstimateForm';




// Default display of the component
export const Default: React.FC<PlanEstimateDataProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();

  return <PlanEstimateDefault {...props} />;
};


// Variants
export const PlanEstiamteForm: React.FC<PlanEstimateDataProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();

  return <PlanEstimateForm {...props} />;
};



