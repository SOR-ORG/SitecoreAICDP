'use client';

import React, { JSX, useEffect, useState } from 'react'
import { RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { SitecoreProviderReactContext } from '@sitecore-content-sdk/nextjs';
import { AllowedPlan, allowedPlans, getPlanEstimate, PlanEstimateInputPayload, planEstimateResponse } from 'components/lib/datalayerhelper';
import { Card, FormRow, MetaRow, NumberInput, SectionHeader, SelectInput, style, SubCopy, TextInput } from 'components/ui/plan-estimate';
import { PlanEstimateDataProps } from './PlanEstimateDefault';


type Split = { peak: number | null; offPeak: number | null };


export const PlanEstimateForm = ({ params, fields }: PlanEstimateDataProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  const { page } = React.useContext(SitecoreProviderReactContext);
  const { pageState } = page.layout.sitecore.context;
  const pageName = page.layout.sitecore.route?.displayName; 

  const planToCompare =
  pageName && allowedPlans.includes(pageName as typeof allowedPlans[number])
    ? pageName
    : 'Green Energy Plan';

  // ===== Result state from API =====
  const [currentPlan, setCurrentPlan] = useState<string | null>('');
  const [currentPlanEstimatedAnnualCost, setCurrentPlanEstimatedAnnualCost] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [newPlanEstimateAnnualCost, setNewPlanEstimateAnnualCost] = useState<string>('');
  const [predictedAnnualUsage, setPredictedAnnualUsage] = useState<string>('');

  // ===== Form state (editable defaults) =====
  const [formPlan, setFormPlan] = useState<string>(planToCompare);
  const [lastYearElectricityKwh, setLastYearElectricityKwh] = useState<number>(4200);
  const [currentYearElectricityKwh, setCurrentYearElectricityKwh] = useState<number>(4200);
  const [lastYearGasTherms, setLastYearGasTherms] = useState<number>(400);
  const [currentYearGasTherms, setCurrentYearGasTherms] = useState<number>(400);
  const [solarProducedKwh, setSolarProducedKwh] = useState<number>(0);
  const [split, setSplit] = useState<Split>({ peak: 50, offPeak: 50 });
  const [currentPlanName, setCurrentPlanName] = useState<string>('Standard Variable');
  const [currentPlanCost, setCurrentPlanCost] = useState<number>(3000);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<boolean>(false);

 
 /* useEffect(() => {
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
    }, [planToCompare]); */

  // Build payload minimal version (you made non-required except plan)
  const buildPayload = (): PlanEstimateInputPayload => ({
    planToCompare: formPlan as AllowedPlan,
    lastYearElectricityUsage: `${Math.max(0, lastYearElectricityKwh)} kWh`,
    currentYearElectricityUsage: `${Math.max(0, currentYearElectricityKwh)} kWh`,
    currentYearGasUsage: `${Math.max(0, currentYearGasTherms)} therms`,
    lastYearGasUsage: `${Math.max(0, lastYearGasTherms)} therms`,
    currentYearSolarEnergyProduced: `${Math.max(0, solarProducedKwh)} kWh`,
    currentMonthElectricitySplit: JSON.stringify({
      peak: `${Math.round(split.peak ?? 0)}%`,
      offPeak: `${Math.round(split.offPeak ?? 0)}%`,
    }),
    currentPlan: currentPlanName,
    currentPlanCost,
  });


  // Sync dropdown with derived plan
  useEffect(() => {
    setFormPlan(planToCompare);
  }, [planToCompare]);



  const handleEstimate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setResult(false);
    try {
      const payload = buildPayload();
      const response = (await getPlanEstimate(payload)) as planEstimateResponse;

      if (response) {
        setCurrentPlan(response.currentPlan);
        setCurrentPlanEstimatedAnnualCost(response.currentPlanEstimatedAnnualCost);
        setDescription(response.description);
        setNewPlanEstimateAnnualCost(response.newPlanEstimateAnnualCost);
        setPredictedAnnualUsage(response.predictedAnnualUsage);
      }
    } catch (e) {
      console.error('Failed to get guest Data:', e);
    } finally {
      setLoading(false);
      setResult(true);
    }
  };


  // Keep Peak + OffPeak = 100
  const onChangePeak = (v: number) => {
    const peak = Math.min(100, Math.max(0, v));
    const off = 100 - peak;
    setSplit({ peak, offPeak: off });
  };



  return (

 <div className={`component PlanEstimateForm ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        {/* Body copy from Sitecore */}
        {fields ? <ContentSdkRichText field={fields.Text} /> : <span className="is-empty-hint">Rich text</span>}

        {/* ===== Card 1: Form + Summary ===== */}
        <Card ariaLabel="Plan Estimate">
          <SectionHeader title="Plan Estimate" />
          <SubCopy>What impact would it have if you switched to the {formPlan}?</SubCopy>

          <form onSubmit={handleEstimate} className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormRow label="Plan to Compare" htmlFor="planToCompare">
              <SelectInput
                id="planToCompare"
                value={formPlan}
                onChange={(e) => setFormPlan(e.target.value as AllowedPlan)}
              >
                {allowedPlans.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </SelectInput>
            </FormRow>

            <FormRow label="Current Plan" htmlFor="currentPlan">
              <TextInput
                id="currentPlan"
                value={currentPlanName}
                onChange={(e) => setCurrentPlanName(e.target.value)}
                placeholder="Standard Variable"
              />
            </FormRow>

            <FormRow label="Current Plan Annual Cost" htmlFor="currentPlanCost">
              <NumberInput
                id="currentPlanCost"
                step="0.01"
                value={currentPlanCost}
                onChange={(e) => setCurrentPlanCost(parseFloat(e.target.value) || 0)}
                placeholder="1500"
              />
            </FormRow>

            <FormRow label="Last Year Electricity (kWh)" htmlFor="lyElec">
              <NumberInput
                id="lyElec"
                min={0}
                value={lastYearElectricityKwh}
                onChange={(e) => setLastYearElectricityKwh(parseFloat(e.target.value) || 0)}
                placeholder="4200"
              />
            </FormRow>

            <FormRow label="Current Year Electricity (kWh)" htmlFor="cyElec">
              <NumberInput
                id="cyElec"
                min={0}
                value={currentYearElectricityKwh}
                onChange={(e) => setCurrentYearElectricityKwh(parseFloat(e.target.value) || 0)}
                placeholder="4200"
              />
            </FormRow>

            <FormRow label="Last Year Gas (therms)" htmlFor="lyGas">
              <NumberInput
                id="lyGas"
                min={0}
                value={lastYearGasTherms}
                onChange={(e) => setLastYearGasTherms(parseFloat(e.target.value) || 0)}
                placeholder="400"
              />
            </FormRow>

            <FormRow label="Current Year Gas (therms)" htmlFor="cyGas">
              <NumberInput
                id="cyGas"
                min={0}
                value={currentYearGasTherms}
                onChange={(e) => setCurrentYearGasTherms(parseFloat(e.target.value) || 0)}
                placeholder="400"
              />
            </FormRow>

            <FormRow label="Current Year Solar Produced (kWh)" htmlFor="solar">
              <NumberInput
                id="solar"
                min={0}
                value={solarProducedKwh}
                onChange={(e) => setSolarProducedKwh(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </FormRow>

            <FormRow
              label="Current Month Split — Peak (%)"
              htmlFor="peak"
              helpText={
                <>
                  Off‑peak will be set to <strong>{split.offPeak}%</strong>
                </>
              }
            >
              <NumberInput
                id="peak"
                min={0}
                max={100}
                value={split.peak ?? 50}
                onChange={(e) => onChangePeak(parseFloat(e.target.value) || 0)}
                placeholder="50"
              />
            </FormRow>

            {/* Actions */}
            <div className="sm:col-span-2 flex items-center gap-3 mt-2">
              <button type="submit" disabled={loading} className={style.buttonPrimary}>
                {loading ? 'Calculating…' : 'Get Estimate'}
              </button>

              <button
                type="button"
                className={style.buttonGhost}
                onClick={() => {
                  setFormPlan(planToCompare);
                  setLastYearElectricityKwh(4200);
                  setCurrentYearElectricityKwh(4200);
                  setLastYearGasTherms(400);
                  setCurrentYearGasTherms(400);
                  setSolarProducedKwh(0);
                  setSplit({ peak: 50, offPeak: 50 });
                  setCurrentPlanName('Standard Variable');
                  setCurrentPlanCost(3000);
                }}
              >
                Reset to Defaults
              </button>
            </div>
          </form>

          {/* Results */}
          {result && ( 
          <div className="mt-6 flex flex-col gap-3">
            <MetaRow large label="Current Plan" value={currentPlan ?? undefined} />
            <MetaRow large label="Current Plan Estimated Annual Cost" value={currentPlanEstimatedAnnualCost} />
            <MetaRow large label="Predicted Annual Usage" value={predictedAnnualUsage} />
            <MetaRow large label={`${formPlan} Estimated Annual Cost`} value={newPlanEstimateAnnualCost} />

            {description && (
              <div
                className={`mt-2 ${style.divider} max-h-0 opacity-0 overflow-hidden group-hover:max-h-40 group-hover:opacity-100 group-focus-within:max-h-40 group-focus-within:opacity-100 transition-all duration-300 ease-out`}
                aria-live="polite"
              >
                <div className="pt-3">
                  <span className="text-sm text-[1.2rem] leading-relaxed">{description}</span>
                </div>
              </div>
            )}

            {description && <div className={`${style.hint} transition-opacity duration-200`}>Hover or focus to see more details</div>}
          </div>
          )}
        </Card>
          


      </div>
    </div>


  );
};

{/*        
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
         */}




