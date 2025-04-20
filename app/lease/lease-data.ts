import { useLeaseStore } from "@/store/leaseStore";

export const leaseData = {
  tenant: {
    name: "Amazon",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "E-commerce / Logistics",
    creditRating: "AA",
  },
  lease: {
    startDate: "2021-09-01",
    expiryDate: "2034-09-30", // 13 years (Sep 37)
    term: "13 Years (Sep 37)",
    remainingTerm: "9 Years, 5 Months",
  },
  rent: {
    baseRentPSF: "$24.40",
    annualBaseRent: "$7,830,000",
    monthlyBaseRent: "$652,500",
    effectiveRentPSF: "$23.15",
  },
  escalations: {
    structure: "Annual",
    rate: "3%",
    nextEscalation: "September 2025",
  },
  renewalOptions: [
    {
      term: "5 Years",
      notice: "12 Months",
      rentStructure: "95% of Fair Market Value",
    },
    {
      term: "5 Years",
      notice: "12 Months",
      rentStructure: "95% of Fair Market Value",
    },
  ],
  recoveries: {
    operatingExpenses: "Triple Net (NNN)",
    cam: "Tenant pays 100% of CAM",
    insurance: "Tenant pays 100% of Insurance",
    taxes: "Tenant pays 100% of Real Estate Taxes",
    utilities: "Direct Tenant Responsibility",
  },
  security: {
    deposit: "$1,957,500",
    equivalent: "3 Months Rent",
    letterOfCredit: "Yes - Bank of America",
  },
  otherTerms: [
    {
      title: "Right of First Refusal",
      description: "Tenant has ROFR on adjacent property at 282 Richards",
    },
    {
      title: "Expansion Option",
      description: "Tenant has option to expand into 25,000 SF of adjacent space",
    },
    {
      title: "Early Termination",
      description: "None",
    },
  ],
  rentSchedule: [
    { year: 2021, rentPSF: 24.4, annualRent: 7830000 },
    { year: 2022, rentPSF: 25.13, annualRent: 8064900 },
    { year: 2023, rentPSF: 25.89, annualRent: 8306847 },
    { year: 2024, rentPSF: 26.66, annualRent: 8556052 },
    { year: 2025, rentPSF: 27.46, annualRent: 8812734 },
    { year: 2026, rentPSF: 28.29, annualRent: 9077116 },
    { year: 2027, rentPSF: 29.14, annualRent: 9349429 },
    { year: 2028, rentPSF: 30.01, annualRent: 9629912 },
    { year: 2029, rentPSF: 30.91, annualRent: 9918810 },
    { year: 2030, rentPSF: 31.84, annualRent: 10216374 },
    { year: 2031, rentPSF: 32.79, annualRent: 10522865 },
    { year: 2032, rentPSF: 33.78, annualRent: 10838551 },
    { year: 2033, rentPSF: 34.79, annualRent: 11163708 },
    { year: 2034, rentPSF: 35.83, annualRent: 11498619 },
  ],
  marketComparison: {
    subjectProperty: { name: "280 Richards", rentPSF: 24.4 },
    marketComps: [
      { name: "39 Edgeboro Road", rentPSF: 23.23 },
      { name: "1 Delham Road", rentPSF: 21.15 },
      { name: "Baylis 495 Business Park", rentPSF: 24.25 },
      { name: "Terminal Logistics Center", rentPSF: 24.05 },
      { name: "Market Average", rentPSF: 23.17 },
    ],
  },
  recoveryBreakdown: {
    cam: 35,
    taxes: 45,
    insurance: 20,
  },
}

// Generate rent schedule data for charts
export const generateRentScheduleData = () => {
  const { leaseData } = useLeaseStore();
  if (!leaseData || !leaseData.rentSchedule) {
    return [];
  }
  return leaseData.rentSchedule.map((item) => ({
    year: item.year.toString(),
    "Rent PSF": item.rentPSF,
  }))
}

// Generate market comparison data for charts
export const generateMarketComparisonData = () => {
  const { leaseData } = useLeaseStore();
  if (!leaseData || !leaseData.marketComparison) {
    return [];
  }
  const data = [
    {
      name: leaseData.marketComparison.subjectProperty.name,
      value: leaseData.marketComparison.subjectProperty.rentPSF,
    },
    ...leaseData.marketComparison.marketComps.map((comp) => ({
      name: comp.name,
      value: comp.rentPSF,
    })),
  ]
  return data
}

// Generate recovery breakdown data for charts
export const generateRecoveryBreakdownData = () => {
  const { leaseData } = useLeaseStore();
  if (!leaseData || !leaseData.recoveryBreakdown) {
    return [];
  }
  return [
    { name: "CAM", value: leaseData.recoveryBreakdown.cam },
    { name: "Taxes", value: leaseData.recoveryBreakdown.taxes },
    { name: "Insurance", value: leaseData.recoveryBreakdown.insurance },
  ]
}

// Generate lease timeline data
export const generateLeaseTimelineData = () => {
  const { leaseData } = useLeaseStore();
  if (!leaseData || !leaseData.lease) {
    return [];
  }
  const startYear = new Date(leaseData.lease.startDate).getFullYear()
  const endYear = new Date(leaseData.lease.expiryDate).getFullYear()

  // Create timeline data
  const timelineData = []

  // Add lease start
  timelineData.push({
    year: startYear.toString(),
    event: "Lease Start",
    description: "Lease commenced",
  })

  // Add renewal options
  const firstRenewalYear = endYear
  const secondRenewalYear = endYear + 5

  timelineData.push({
    year: endYear.toString(),
    event: "Initial Term End / Renewal 1",
    description: "First renewal option (5 years)",
  })

  timelineData.push({
    year: secondRenewalYear.toString(),
    event: "Renewal 2",
    description: "Second renewal option (5 years)",
  })

  return timelineData
}
