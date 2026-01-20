'use client';

import React, { JSX, useEffect, useState } from 'react'
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import {SitecoreProviderReactContext } from '@sitecore-content-sdk/nextjs';
import { allowedPlans, getPlanEstimate, PlanEstimateInputPayload, planEstimateResponse } from 'components/lib/datalayerhelper';
import { Card, MetaRow, SectionHeader, style, SubCopy } from 'components/ui/plan-estimate';

interface Fields {
  Text: Field<string>;
  PlanToCompare: string;
}

export type PlanEstimateDataProps = ComponentProps & {
  fields: Fields;
};

export const PlanEstimateDefault = ({ params, fields }: PlanEstimateDataProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  const { page } = React.useContext(SitecoreProviderReactContext);
  const { pageState } = page.layout.sitecore.context;
  const pageName = page.layout.sitecore.route?.displayName; 

  console.log("'",page.mode.isPreview, "'- -'", page.mode.name,"'");
  console.log("page name: ",pageName);

  const planToCompare =
  pageName && allowedPlans.includes(pageName as typeof allowedPlans[number])
    ? pageName
    : 'Green Energy Plan';

  const [currentPlan, setCurrentPlan] = useState<string | null>('');
  const [currentPlanEstimatedAnnualCost, setCurrentPlanEstimatedAnnualCost] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [newPlanEstimateAnnualCost, setNewPlanEstimateAnnualCost] = useState<string>('');
  const [predictedAnnualUsage, setPredictedAnnualUsage] = useState<string>('');

 
  useEffect(() => {
      (async () => {
        try {
          const payload = {
           'planToCompare':  planToCompare
          } as PlanEstimateInputPayload;
          const response = await getPlanEstimate (payload) as planEstimateResponse; 

          if (response) {

            setCurrentPlan(response.currentPlan);
            setCurrentPlanEstimatedAnnualCost(response.currentPlanEstimatedAnnualCost);
            setDescription(response.description);
            setNewPlanEstimateAnnualCost(response.newPlanEstimateAnnualCost);
            setPredictedAnnualUsage(response.predictedAnnualUsage);
            
        }

        } catch (e) {
          console.error('Failed to get guest Data:', e);
        }
      })();
    }, [planToCompare]);

  return (
    <div className={`component PlanEstimateDefault ${styles}`} id={RenderingIdentifier}>

      <div className="component-content">

        {/* ===== Body copy from Sitecore (kept as-is) ===== */}
        {fields ? (
          <ContentSdkRichText field={fields.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}

        {/* ===== Summary Header Card (inline styled) ===== */}
        <Card ariaLabel="Plan Estimate (Large)">
          <SectionHeader title="Plan Estimate" large />
          <SubCopy large>What impact would it have if you switched to the {planToCompare}</SubCopy>

          <div className="mt-4 flex flex-col gap-3">
            <MetaRow large label=" Your Current Plan" value={currentPlan ?? undefined} />
            <MetaRow large label="Current Plan Estimated Annual Cost" value={currentPlanEstimatedAnnualCost} />
            <MetaRow large label="Predicted Annual Usage" value={predictedAnnualUsage} />
            <MetaRow large label={`${planToCompare} Estimated Annual Cost`} value={newPlanEstimateAnnualCost} />

            {description && (
              <div
                className={`mt-2 ${style.divider} max-h-0 opacity-0 overflow-hidden group-hover:max-h-80 group-hover:opacity-100 group-focus-within:max-h-80 group-focus-within:opacity-100 transition-all duration-300 ease-out`}
                aria-live="polite"
              >
                <div className="pt-3">
                  <span className="text-[1.3rem] text-[#e0e1e3] leading-relaxed">{description}</span>
                </div>
              </div>
            )}

            {description && <div className={`${style.hintLg} transition-opacity duration-200`}>Hover or focus to see more details</div>}
          </div>
        </Card>

      </div>

    </div>
  );
};




