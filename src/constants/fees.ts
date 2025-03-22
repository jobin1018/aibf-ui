export interface FeePackage {
  name: string;
  description: string;
  adultPrice: number;
  child9to13Price: number;
  child3to8Price: number;
  isDayVisitor?: boolean;
  mealPrices?: {
    adult: number;
    kids913: number;
    kids38: number;
  };
}

export const feeStructure: FeePackage[] = [
  {
    name: "4-Day Package (Thu-Sun)",
    description:
      "Includes 3 nights accommodation & 9 meals (3*Breakfast included)",
    adultPrice: 338,
    child9to13Price: 254,
    child3to8Price: 169,
  },
  {
    name: "3-Day Package (Fri-Sun)",
    description:
      "Includes 2 nights accommodation & 8 meals (2*Breakfast included)",
    adultPrice: 247,
    child9to13Price: 174,
    child3to8Price: 126,
  },
  {
    name: "2-Day Package (Sat-Sun)",
    description:
      "Includes 1 night accommodation & 5 meals (1*Breakfast included)",
    adultPrice: 133,
    child9to13Price: 102,
    child3to8Price: 68,
  },
  {
    name: "Day Visitors",
    description: "Entry fee with optional meal add-on",
    adultPrice: 16,
    child9to13Price: 16,
    child3to8Price: 16,
    isDayVisitor: true,
    mealPrices: {
      adult: 19,
      kids913: 15,
      kids38: 10,
    },
  },
];

// For easier lookup in RegisterForm
export const PRICES = {
  "4-Day Package (Thu-Sun)": {
    adult: 338,
    kids913: 254,
    kids38: 169,
  },
  "3-Day Package (Fri-Sun)": {
    adult: 247,
    kids913: 174,
    kids38: 126,
  },
  "2-Day Package (Sat-Sun)": {
    adult: 133,
    kids913: 102,
    kids38: 68,
  },
  "Day Visitors": {
    adult: 16,
    kids913: 16,
    kids38: 16,
    mealPrices: {
      adult: 19,
      kids913: 15,
      kids38: 10,
    },
  },
};

export const bankDetails = {
  accountName: "AIBF",
  bankName: "ANZ Bank",
  accountNumber: "412910238",
  bsb: "013 148",
};
