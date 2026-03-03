export type TenderDownload = {
  label: string;
  href: string;
};

export type TenderCountry = {
  slug: string;
  label: string;
  title: string;
  tenderNo?: string;
  tenderName?: string;
  sections: Array<{
    heading?: string;
    paragraphs?: string[];
    bullets?: string[];
  }>;
  downloads?: TenderDownload[];
};

export const tenderCountries: TenderCountry[] = [
  {
    slug: "kenya",
    label: "KENYA",
    title: "KENYA",
    sections: [
      {
        paragraphs: ["No active tender details are currently published for Kenya on the live AVLC Tender Openings page."],
      },
    ],
  },
  {
    slug: "rwanda",
    label: "RWANDA",
    title: "RWANDA",
    tenderNo: "MHL/KAG/10/2022 -2025",
    tenderName: "Tender for Proposed Construction of Kagarama housing project in Kicukiro District, Kigali, Rwanda",
    sections: [
      {
        heading: "Project Name",
        paragraphs: ["KAGARAMA HOUSING PROJECT"],
      },
      {
        heading: "Project Summary",
        paragraphs: [
          "KAGARAMA HOUSING PROJECT; Enabling Multi-Family Living in Kicukiro District, Kigali, Rwanda.",
          "This project presents an opportunity to champion multi-family living in Rwanda, while simultaneously delivering affordable housing for the middle-class. The Kagarama housing project is a multi-unit development, which involves a unique blend of developing apartments of different configurations and allied facilities in the district.",
          "Apartments are expected to house 1084 families. Each of the apartment units will have 2 bathrooms, a lounge, a dining room, a kitchen, a master ensuite and 2 other bedrooms. Apartments will be housed in 35 seven-storey blocks, 4 apartment units on each floor.",
          "Each of the 1084 apartment units has an open-concept balcony and will have a centralized Gas System and Solar energy. In addition, the development of this site will provide green space, walkways and driveways, allied properties (shopping complex, nursery school, clubhouse, basket and tennis courts) and communal utility systems (water and electricity supply related) to mitigate against future shortages.",
          "Each apartment unit and/or facility will be individually metered for utilities and have its own hot water and air conditioning units.",
          "The lead arranger for the above project is AVLC Group Kenya.",
        ],
      },
    ],
    downloads: [
      {
        label: "Pre-qualification of contractors - Kagarama Project",
        href: "http://www.avlc-group.com/wp-content/uploads/2023/08/Pre-qualification-of-contractors-Kagarama-Project-1.pdf",
      },
      {
        label: "GENERAL CIS",
        href: "http://www.avlc-group.com/wp-content/uploads/2023/08/GENERAL-CIS-.pdf",
      },
    ],
  },
  {
    slug: "drc-congo",
    label: "DRC CONGO",
    title: "DRC CONGO",
    tenderName: "Tender for Proposed Construction of Cité Limpamboli - First Smart Gate Community Project in Kasangulu, DRC.",
    sections: [
      {
        heading: "Project Name",
        paragraphs: ["PROPOSED CONSTRUCTION OF CITE LIMPAMBOLI - FIRST SMART GATE COMMUNITY IN KASANGULU, DRC"],
      },
      {
        heading: "Project Description",
        paragraphs: [
          "This TURNKEY project presents the opportunity to champion a first of its kind smart-gated city in the Democratic Republic of Congo, away from heavy traffic and pollution, while simultaneously delivering quality and affordable housing for the middle and upper classes of the country.",
          "The Cite Limpamboli project is a multi-unit development involving apartments and houses of different configurations and allied facilities.",
          "The Cite sits on about 40 hectares of prime land in Kasangulu, Kongo Central, capable of accommodating multi-story condominiums, a level 4 hospital, a school, a train station, a water theme park, a mall among other facilities.",
          "With an estimate of 336 apartments and 294 houses, each apartment will be 2, 3 and 4 bedroomed with 2-3 bathrooms, a lounge, a dining room, a kitchen, and a master ensuite. Apartments will be housed in six, 7-storey blocks, with ample parking space for residents.",
        ],
      },
      {
        heading: "Project Details",
        bullets: [
          "Project Value: Approximately between USD 140m - USD 160m",
          "Project Period: 36 - 52 months",
          "Number of Phases: 4 - 6 phases",
          "Cost per Phase: USD 28m - USD 30m",
          "Project Manager and Architect: UDESIGN LIMITED - Arch Mutahi",
          "Contractor: TBA",
          "Project QS: TBA",
          "Financial Advisors and Arrangers: AVLC Group - Andrew Kanyutu",
          "Project Bankers: Equity BCDC and Rawbank DRC",
        ],
      },
      {
        heading: "Project Timelines",
        bullets: [
          "Finalize the BOQS - 31st October 2023",
          "Contract Signing - 5th November 2023",
          "Project Media Launch & Ground Breaking - 8th to 11th November 2023",
          "Mobilization - End November 2023",
        ],
      },
      {
        heading: "Construction and Payment",
        paragraphs: [
          "Infrastructure construction and construction of houses are funded by the developer.",
          "Payments are guaranteed by an irrevocable and confirmed SBLC issued by project bankers and confirmed by a tier 1 bank.",
          "Payment milestone is completion in full of all houses in each phase.",
          "Project pricing and details shall be provided separately.",
        ],
      },
    ],
    downloads: [
      {
        label: "Pre-qualification of contractors - DRC Housing Project",
        href: "http://www.avlc-group.com/wp-content/uploads/2023/08/Pre-qualification-of-contractors-DRC-Housing-Project.pdf",
      },
      {
        label: "GENERAL CIS",
        href: "http://www.avlc-group.com/wp-content/uploads/2023/08/GENERAL-CIS-.pdf",
      },
    ],
  },
  {
    slug: "tanzania",
    label: "TANZANIA",
    title: "TANZANIA",
    sections: [
      {
        paragraphs: ["No active tender details are currently published for Tanzania on the live AVLC Tender Openings page."],
      },
    ],
  },
  {
    slug: "uganda",
    label: "UGANDA",
    title: "UGANDA",
    sections: [
      {
        paragraphs: ["No active tender details are currently published for Uganda on the live AVLC Tender Openings page."],
      },
    ],
  },
  {
    slug: "burundi",
    label: "BURUNDI",
    title: "BURUNDI",
    sections: [
      {
        paragraphs: ["No active tender details are currently published for Burundi on the live AVLC Tender Openings page."],
      },
    ],
  },
  {
    slug: "south-sudan",
    label: "SOUTH SUDAN",
    title: "SOUTH SUDAN",
    sections: [
      {
        paragraphs: ["No active tender details are currently published for South Sudan on the live AVLC Tender Openings page."],
      },
    ],
  },
];

export const tenderNavItems = tenderCountries.map((country) => ({
  href: `/tender-openings/${country.slug}`,
  label: country.label,
}));

export const tenderCountryMap = Object.fromEntries(
  tenderCountries.map((country) => [country.slug, country]),
);
