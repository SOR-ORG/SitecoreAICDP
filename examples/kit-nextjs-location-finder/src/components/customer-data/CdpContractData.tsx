'use client';

import React, { JSX, useEffect, useState } from 'react'
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { LayoutServicePageState, SitecoreProviderReactContext } from '@sitecore-content-sdk/nextjs';
import { guestDetailsResponse, getGuestDetails } from 'components/lib/datalayerhelper';
import { dateFormatter, formatCurrency, normalizeSplit, normalizeTariffToPercent, formatPercent} from 'components/lib/utils'

interface Fields {
  Text: Field<string>;
}

export type CdpContractDataProps = ComponentProps & {
  fields: Fields;
};

type Split = { peak: number | null; offPeak: number | null };


export const Default = ({ params, fields }: CdpContractDataProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  const { page } = React.useContext(SitecoreProviderReactContext);
  const { pageState } = page.layout.sitecore.context;


  // NEW inline-state for more customer info
  const [nextPaymentDate, setNextPaymentDate] = useState<string>(pageState === LayoutServicePageState.Preview ? '12 Feb 2000' : '<<Next Payment Date>>');
  const [accountBalance, setAccountBalance] = useState<number | null>(0.00);
  const [plan, setPlan] = useState<string>('<<Plan>>');
  const [currentMonthElectricityUsage, setCurrentMonthElectricityUsage] = useState<string>(pageState === LayoutServicePageState.Preview ? '0 kWh' : '<<Electricity Usage>>');
  const [currentMonthGasUsage, setCurrentMonthGasUsage] = useState<string>(pageState === LayoutServicePageState.Preview ? '0 therms' : '<<Gas Usage>>');
  const [currentMonthSolarEnergyProduced, setCurrentMonthSolarEnergyProduced] = useState<string>(pageState === LayoutServicePageState.Preview ? '0 kWh' : '<<Solar Energy>>');
  const [contractPeriod, setContractPeriod] = useState<string>(pageState === LayoutServicePageState.Preview ? '1 Feb 2000 to 2 Feb 2000' : '<<Contract Start Date>>');
  const [contractTerm, setContractTerm] = useState<string>(pageState === LayoutServicePageState.Preview ? '1 month' : '<<Contract Term>>');


  // New: normalized splits (percent)
  const [electricitySplit, setElectricitySplit] = useState<Split>({ peak: null, offPeak: null });

  useEffect(() => {
      (async () => {
        try {

          const response = await getGuestDetails () as guestDetailsResponse;

          if (response) {
            if (response.firstSeen) {


              for (let i = 0; i < response.dataExtensions.length; i++) {
                const ext = response.dataExtensions[i];

                const v = ext.values;


                // Contract period
                if (v?.contractStartDate) {
                  setContractPeriod(
                    `${dateFormatter(v.contractStartDate)} to ${dateFormatter(v.contractEndDate)}`
                  );
                } else {
                  setContractPeriod('');
                }

                // Core fields
                setContractTerm(v?.contractTerm || '');
                setPlan(v?.plan || '');
                setNextPaymentDate(v?.nextPaymentDate ? dateFormatter(v.nextPaymentDate) : '');
                setAccountBalance(typeof v?.accountBalance === 'number' ? v.accountBalance : null);

                // Usage metrics
                setCurrentMonthElectricityUsage(v?.currentMonthElectricityUsage || '');
                setCurrentMonthGasUsage(v?.currentMonthGasUsage || '');
                setCurrentMonthSolarEnergyProduced(v?.currentMonthSolarEnergyProduced || '');

                // New: normalized splits
                setElectricitySplit(normalizeSplit(v?.currentMonthElectricitySplit));


              }
            }
        }

        } catch (e) {
          console.error('Failed to get guest data:', e);
        }
      })();
    }, []);

  return (
    <div className={`component CdpContractData ${styles}`} id={RenderingIdentifier}>

        {/* ===== Body copy from Sitecore (kept as-is) ===== */}
        {fields ? (
          <ContentSdkRichText field={fields.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}

      <div className="component-content">


        {/* Summary card */}
        <section
          aria-labelledby="contract-data-title"
          data-component="ContractData"
          className="
            relative w-full overflow-hidden
            bg-[#0b0b0c] text-foreground
            border border-[#1f2022] rounded-xl
            px-4 py-4 sm:px-5 sm:py-5
            shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]
          "
        >
          {/* Top row: Plan on left; Amount Due + Next payment stacked on right */}
          <div className="flex items-start justify-between gap-3">
            <h3
              id="contract-data-title"
              className="font-heading text-[1.05rem] sm:text-[1.15rem] font-semibold text-[#f2f3f5]"
            >
              {plan || 'Plan'}
            </h3>

            <div className="flex flex-col items-end gap-1 min-w-[160px]">
              {accountBalance !== null && (
                <div
                  className={[
                    'px-3 py-1 rounded-full border text-sm font-semibold',
                    'bg-[#121314] border-[#2a2b2d]',
                    accountBalance < 0 ? 'text-[#ffb3b3]' : 'text-[#b8f7c3]',
                  ].join(' ')}
                  title="Amount due"
                >
                  {formatCurrency(accountBalance)}
                </div>
              )}

              {/* Next payment placed directly under amount due (top-right corner) */}
              {nextPaymentDate && (
                      <div className="text-[0.95rem] sm:text-base font-medium text-[#e6e7e9]">
                        <span className="text-[#b5b8bc] font-normal">Due:</span>{' '}
                        {nextPaymentDate}
                      </div>
                    )}

            </div>
          </div>

          {/* Details grid: label → value pairs, with related pairs on the same row */}
          {/* Grid columns: [L1, V1, L2, V2] so values sit to the right of their titles */}
          <dl
            className="
              mt-6 grid gap-x-8 gap-y-4 items-start
              grid-cols-1
              sm:[--label-w:180px] sm:[--value1-w:150px]
              sm:grid-cols-[minmax(var(--label-w),auto)_minmax(var(--value1-w),1fr)_minmax(180px,auto)_1fr]
            "
          >
            {/* Row 1: Contract Period | Contract Term */}
            {contractPeriod && (
              <>
                <Dt>Contract Period</Dt>
                <Dd>{contractPeriod}</Dd>

                {/* Right pair on same row */}
                {contractTerm ? (
                  <>
                    <Dt>Contract Term</Dt>
                    <Dd>{contractTerm}</Dd>
                  </>
                ) : (
                  <>
                    {/* Fill the two right slots when absent to keep grid alignment */}
                    <div className="hidden sm:block" />
                    <div className="hidden sm:block" />
                  </>
                )}
              </>
            )}

            {/* Row 2: Electricity usage (month) | Electricity split */}
            {(currentMonthElectricityUsage ||
              electricitySplit.peak !== null ||
              electricitySplit.offPeak !== null) && (
              <>
                <Dt>Electricity usage (month)</Dt>
                <Dd>{currentMonthElectricityUsage || '-'}</Dd>

                {(electricitySplit.peak !== null || electricitySplit.offPeak !== null) ? (
                  <>
                    <Dt>Electricity usage split</Dt>
                    <Dd>
                      <span className="inline-flex gap-4">
                        <span>Peak: {formatPercent(electricitySplit.peak)}</span>
                        <span>Off‑peak: {formatPercent(electricitySplit.offPeak)}</span>
                      </span>
                    </Dd>
                  </>
                ) : (
                  <>
                    <div className="hidden sm:block" />
                    <div className="hidden sm:block" />
                  </>
                )}
              </>
            )}

            {/* Row 3: Gas usage (month) | Solar energy produced (month) */}
            {(currentMonthGasUsage || currentMonthSolarEnergyProduced) && (
              <>
                <Dt>Gas usage (month)</Dt>
                <Dd>{currentMonthGasUsage || '-'}</Dd>

                {currentMonthSolarEnergyProduced ? (
                  <>
                    <Dt>Solar energy produced (month)</Dt>
                    <Dd>{currentMonthSolarEnergyProduced}</Dd>
                  </>
                ) : (
                  <>
                    <div className="hidden sm:block" />
                    <div className="hidden sm:block" />
                  </>
                )}
              </>
            )}

          </dl>
        </section>



      </div>

    </div>
  );
};




/** Label (left column) */
const Dt = ({ children }: { children: React.ReactNode }) => (
  <dt className="text-sm text-[#b5b8bc] leading-6 whitespace-nowrap">{children}</dt>
);

/** Value (right column, aligned) */
const Dd = ({ children }: { children: React.ReactNode }) => (
  <dd className="text-sm text-[#e6e7e9] leading-6">{children}</dd>
);








