'use client';

import React, { JSX, useEffect, useState } from 'react'
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { LayoutServicePageState, SitecoreProviderReactContext } from '@sitecore-content-sdk/nextjs';
import { getPlanEstimate, planEstimateResponse } from 'components/lib/datalayerhelper';

interface Fields {
  Text: Field<string>;
  PlanToCompare: string;
}

export type PlanEstimateDataProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: PlanEstimateDataProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  const { page } = React.useContext(SitecoreProviderReactContext);
  const { pageState } = page.layout.sitecore.context;

  console.log("'",pageState, "'- -'", LayoutServicePageState.Preview,"'");

  const planToCompare = fields.PlanToCompare ? (fields.PlanToCompare) : ('Green Energy Plan');

  const [currentPlan, setCurrentPlan] = useState<string | null>('');
  const [currentPlanEstimatedAnnualCost, setCurrentPlanEstimatedAnnualCost] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [newPlanEstimateAnnualCost, setNewPlanEstimateAnnualCost] = useState<string>('');
  const [predictedAnnualUsage, setPredictedAnnualUsage] = useState<string>('');

 
  useEffect(() => {
      (async () => {
        try {

          const response = await getPlanEstimate (planToCompare) as planEstimateResponse; 

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
    <div className={`component PlanEstimate ${styles}`} id={RenderingIdentifier}>

      <div className="component-content">

        {/* ===== Body copy from Sitecore (kept as-is) ===== */}
        {fields ? (
          <ContentSdkRichText field={fields.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}

        {/* ===== Summary Header Card (inline styled) ===== */}
        <section
          data-component="PlanComparisionDetails"
          className="
            group relative w-full overflow-hidden
            bg-[#0c0c0d] text-foreground
            border border-[#1f2022] rounded-xl
            px-5 py-6 sm:px-6 sm:py-7
            shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]
            focus-within:ring-1 focus-within:ring-[#2a6df5]
          "
          tabIndex={0} // makes the card focusable for keyboard users
          aria-label="Plan Estimate"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="font-heading text-[1.2rem] sm:text-[1.3rem] font-semibold text-[#f5f6f7] tracking-tight">

              Plan Estimate
            </h3>
          </div>

           <div className="flex items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-baseline gap-2 text-right">
              <span className="text-[0.85rem] text-[#d3d4d6] leading-snug">
                What impact would it have if you switched to the {planToCompare}
              </span>
            </div>

          </div>

          {/* Meta row */}
          <div className="mt-4 flex flex-col gap-3">

            {currentPlan && (
              <div className="flex justify-between">
                <span className="text-sm text-[#a7a9ac]">Current Plan</span>
                <span className="text-sm text-[#f1f1f2]">{currentPlan}</span>
              </div>
            )}

            {currentPlanEstimatedAnnualCost && (
              <div className="flex justify-between">
                <span className="text-sm text-[#a7a9ac]">Current Plan Estimated Annual Cost</span>
                <span className="text-sm text-[#f1f1f2]">{currentPlanEstimatedAnnualCost}</span>
              </div>
            )}

            {predictedAnnualUsage && (
              <div className="flex justify-between">
                <span className="text-sm text-[#a7a9ac]">Predicted Annual Usage</span>
                <span className="text-sm text-[#f1f1f2]">{predictedAnnualUsage}</span>
              </div>
            )}

            {newPlanEstimateAnnualCost && (
              <div className="flex justify-between">
                <span className="text-sm text-[#a7a9ac]">{planToCompare} Estimated Annual Cost</span>
                <span className="text-sm text-[#f1f1f2]">{newPlanEstimateAnnualCost}</span>
              </div>
            )}


          {/* Hover/focus-only Description */}
          {description && (
            <div
              className="
                mt-2
                border-t border-[#1e1f21]
                max-h-0 opacity-0 overflow-hidden
                group-hover:max-h-40 group-hover:opacity-100
                group-focus-within:max-h-40 group-focus-within:opacity-100
                transition-all duration-300 ease-out
              "
              aria-live="polite"
            >
              <div className="pt-3">
                <span className="text-sm text-[#e0e1e3] leading-relaxed">{description}</span>
              </div>
            </div>
          )}

          {/* Subtle helper text to hint hover */}
          {description && (
            <div className="mt-2 text-[0.75rem] text-[#8e9094] select-none pointer-events-none 
            opacity-80 group-hover:opacity-0 group-focus-within:opacity-0 transition-opacity duration-200">
              Hover or focus to see more details
            </div>
          )}


          </div>


        </section>



      </div>

    </div>
  );
};





