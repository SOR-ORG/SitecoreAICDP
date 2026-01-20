
type identifier = {
  ref: string;
  createdAt: string;
  modifiedAt: string;
  provider: string;
  id: string;
};

type emails = [];

type energyDataExtension = {
  nextPaymentDate: string;
  contractStartDate: string;
  contractTerm: string;
  contractEndDate: string;
  tariff: string;
  tariffRates: string;
  accountBalance: number;
  plan: string;
  currentMonthElectricityUsage: string;
  currentMonthElectricitySplit: string;
  currentMonthGasUsage: string;
  currentMonthSolarEnergyProduced: string;
};

type dataExtension = {
  ref: string;
  createdAt: string;
  modifiedAt: string;
  name: string;
  key: string;
  values: energyDataExtension;
};

type segment = {
  ref: string;
  clientKey: string;
  name: string;
};

type order = {
  status: string;
};

export type guestDetailsResponse = {
  ref: string;
  lastName: string;
  gender: string;
  modifiedAt: string;
  identifiers: Array<identifier>;
  firstSeen: string;
  language: string;
  title: string;
  emails: emails;
  createdAt: string;
  firstName: string;
  lastSeen: string;
  nationality: string;
  dataExtensions: Array<dataExtension>;
  segmentMemberships: Array<segment>;
  orders: Array<order>;
  guestType: string;
  email: string;
  unknown: boolean;
};

export type planEstimateResponse = {
  currentPlan: string;
  predictedAnnualUsage: string;
  currentPlanEstimatedAnnualCost: string;
  newPlanEstimateAnnualCost: string;
  description: string;
};

export const allowedPlans = [
  'Time-of-Use (TOU) Energy Plan',
  'Fixed-Rate Energy Plan',
  'Green Energy Plan',
  'Prepaid Energy Plan',
] as const;

export type AllowedPlan = (typeof allowedPlans)[number];


export type PlanEstimateInputPayload =
  { planToCompare: AllowedPlan } &
  Partial<{
    lastYearElectricityUsage: string;       // e.g., "4200 kWh"
    currentYearElectricityUsage: string;    // e.g., "4200 kWh"
    currentYearGasUsage: string;            // e.g., "400 therms"
    lastYearGasUsage: string;               // e.g., "400 therms"
    currentYearSolarEnergyProduced: string; // e.g., "0 kWh"
    currentMonthElectricitySplit: string;   // e.g., '{"peak":"50%","offPeak":"50%"}'
    currentPlan: string;                    // e.g., "Standard Variable"
    currentPlanCost: number;                // e.g., 1500
  }>;



export async function getGuestDetails() {

  const per = await import('@sitecore-cloudsdk/personalize/browser');
  
  const personalizationData = {
    channel: "WEB",
    friendlyId: 'full_guest_details',
  };
  
  const response = (await per.personalize(personalizationData)) as guestDetailsResponse;
  console.log('guest details response:', response);

  return response;
}


export async function getPlanEstimate(payload: PlanEstimateInputPayload) {
  const per = await import('@sitecore-cloudsdk/personalize/browser');

  // Build params by stripping undefined values
  const rawParams = {
    planToCompare: payload.planToCompare,
    lastYearElectricityUsage: payload.lastYearElectricityUsage,
    currentYearElectricityUsage: payload.currentYearElectricityUsage,
    currentYearGasUsage: payload.currentYearGasUsage,
    lastYearGasUsage: payload.lastYearGasUsage,
    currentYearSolarEnergyProduced: payload.currentYearSolarEnergyProduced,
    currentMonthElectricitySplit: payload.currentMonthElectricitySplit,
    currentPlan: payload.currentPlan,
    currentPlanCost: payload.currentPlanCost,
  } as const;

  const params = Object.fromEntries(
    Object.entries(rawParams).filter(([, v]) => v !== undefined && v !== null)
  );

  const personalizationData = {
    channel: 'WEB',
    friendlyId: 'plan_estimate',
    params, // only defined values are sent
  };

  const response = await per.personalize(personalizationData);
  return response as planEstimateResponse;
}


export async function sendIdentityEvent(email:string) {

  const e = await import('@sitecore-cloudsdk/events/browser');
  
  const eventData = {
    email,
    identifiers: [
      {
        id: email,
        provider: "email",
      },
    ]
  };

  e.identity(eventData);
  
}