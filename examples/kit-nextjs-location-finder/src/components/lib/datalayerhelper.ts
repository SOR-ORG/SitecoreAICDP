
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

export async function getGuestDetails() {

  const mod = await import('@sitecore-cloudsdk/core/browser');
  const per = await import('@sitecore-cloudsdk/personalize/browser');
  
  const personalizationData = {
    channel: "WEB",
    friendlyId: 'full_guest_details',
  };
  
  const response = (await per.personalize(personalizationData)) as guestDetailsResponse;
  console.log('response:', response);

  return response;
}