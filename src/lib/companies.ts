export type CompanySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type CompanyProfile = {
  slug: string;
  navLabel: string;
  cardName: string;
  pageTitle: string;
  logo: string;
  heroImage?: string;
  introHeading?: string;
  summary: string;
  intro: string[];
  sections: CompanySection[];
  contact?: string[];
  downloadCta?: {
    label: string;
    href: string;
  };
};

export const companyProfiles: Record<string, CompanyProfile> = {
  "avl-capital": {
    slug: "avl-capital",
    navLabel: "AVL CAPITAL",
    cardName: "AVL Capital",
    pageTitle: "AVL CAPITAL",
    logo: "/assets/companies/avlcapital.png",
    heroImage: "/assets/companies/avlcapital-hero.png",
    introHeading: "WHO WE ARE",
    summary:
      "AVL Capital Limited is a licensed Digital Credit Provider (DCP) regulated by the Central Bank of Kenya, authorized to offer credit through digital and structured financing platforms. The company focuses on delivering customized financial solutions tailored to the evolving needs of individuals and businesses, leveraging technology, data-driven insights, and innovative lending models.",
    intro: [
      "AVL Capital Limited is a licensed Digital Credit Provider (DCP) regulated by the Central Bank of Kenya, authorized to offer credit through digital and structured financing platforms. The company focuses on delivering customized financial solutions tailored to the evolving needs of individuals and businesses, leveraging technology, data-driven insights, and innovative lending models.",
    ],
    sections: [
      {
        title: "OUR VISION",
        paragraphs: [
          "To be the preferred private equity fund services provider contributing to the economic growth of Africa.",
        ],
      },
      {
        title: "OUR MISSION",
        paragraphs: [
          "To provide excellent, innovative, credible financial services to each of our clients with an aim of empowering them to build a strong financial base and successful businesses.",
        ],
      },
      {
        title: "Value Proposition",
        bullets: [
          "Heavy investment in systems and structures that govern operation of the company.",
          "A top-rated Credit appraisal policy for all products.",
          "100 % growth in the first two years of operation.",
          "Well researched market intelligence on product innovation.",
          "Strong synergy with local banks for client referrals.",
          "Negligible default rate of 1.95% 2.00% for the last two financial years.",
          "Continuous training and development courses for staff in designated areas.",
          "Good corporate governance structures.",
          "Investment in corporate social initiatives and sponsorship of youth into internship programs.",
        ],
      },
      {
        title: "CORE PRODUCTS/SERVICES",
        bullets: [
          "Capital Financing and short term Loans",
          "LPO financing",
          "Trade finance & structured trade finance",
          "Microfinance & microcredit services",
          "Finance advisory services",
        ],
      },
      {
        title: "KEY ACHIEVEMENTS",
        paragraphs: [
          "Financial Achievements: AVL Capital maintains high operational standards through strong internal controls, well defined procedures for transaction monitoring, internal authorizations, data backups, and contingency planning. The company also engages legal and audit experts to ensure statutory compliance, risk management, internal audits, tax compliance, and effective debt collection.",
        ],
      },
      {
        title: "NONFINANCIAL ACHIEVEMENTS",
        bullets: [
          "AVL Capital Ltd, was on 5thJune 2025 Licensed as a Digital Credit Provider by the Central Bank of Kenya.",
          "AVL Capital has emerged to prove that access to private lending is viable business in the current market.",
          "Frontier for the ongoing registration of the Private Lending Association of Kenya whose vision is to enable a forum for all members, act as a collective lobby to advance members' collective interests and serve as a liaison between members and the public, the government, and other institutions in Kenya and worldwide.",
          "Growth in ongoing relations with more Banks in the market having confidence in our service delivery. Registration of AVL Capital Sacco for members working in financial institutions and firms.",
        ],
      },
    ],
  },
  "africa-instruments": {
    slug: "africa-instruments",
    navLabel: "AFRICA INSTRUMENTS",
    cardName: "Africa Instruments",
    pageTitle: "AFRICA INSTRUMENTS",
    logo: "/assets/companies/africa-instruments.png",
    heroImage: "/assets/companies/africa-instruments.png",
    introHeading: "WHO WE ARE",
    summary:
      "Africa Instruments has been established as a link between local commodity traders and the global market.",
    intro: [
      "Africa Instruments has been established as a link between local commodity traders and the global market, to offer solutions such as supply chain finance, structured finance and consultancy in financial instruments globally.",
      "We recognize the uniqueness of every client and situation; to this end we support local SMES & MSMES by providing innovative financial solutions. Employing our services offers immediate results with creative plans that meet the unique set of financial circumstances of each client and maximizes business opportunities.",
    ],
    sections: [
      {
        title: "Contact Addresses",
        bullets: [
          "Andrew Kanyutu - Managing Director - akanyutu@avlcapital.com",
          "John Kageche - Director/Principle Officer - jkageche@avlcapital.com",
          "Moses Nyaga - Director/Chairman - mosesnyagamuriithi@gmail.com",
          "Group Website - AVLC Group - www.avlc-group.com",
          "Postal Box - AVLC Group - 35502-00100 Nairobi, Kenya",
          "Phone: 020-230 4180 / 0718-140 125",
          "Email - AVLC Group - info@avlcapital.com",
        ],
      },
    ],
  },
  "avlc-global-consultants": {
    slug: "avlc-global-consultants",
    navLabel: "AVLC GLOBAL CONSULTANTS",
    cardName: "AVLC Global Consultants",
    pageTitle: "AVLC GLOBAL CONSULTANTS",
    logo: "/assets/companies/avlc-global.png",
    heroImage: "/assets/companies/avlc-global.png",
    introHeading: "WHO WE ARE",
    summary:
      "AVLC Global Consultants Limited is a regional consultancy firm with proven expertise in financial structuring, institutional capacity building, and advisory services.",
    intro: [
      "AVLC Global Consultants Limited is a regional consultancy firm with proven expertise in financial structuring, institutional capacity building, and advisory services across East Africa, Burundi, and Zimbabwe.",
    ],
    sections: [
      {
        title: "WHO WE ARE",
        paragraphs: [
          "As the Special Purpose Vehicle (SPV) within the AVLC Group, AVLC Global Consultants serves as the primary gateway for accessing investor funding and channeling these resources to group companies, ensuring that all investments are deployed strategically and aligned with each company's vision and growth objectives.",
          "We are committed to unlocking long-term private investment opportunities in Africa, one of the world's fastest-growing regions, by connecting capital with high-impact ventures and sustainable development goals.",
          "Our focus is on generating sustainable and superior performance for all stakeholders through world-class expertise, disciplined execution, and best-in-class governance practices. We leverage our deep local market knowledge and strategic networks to identify, structure, and manage investments across high-potential sectors.",
          "As a strategic consultant and lead arranger, AVLC Global Consultants provides end-to-end solutions that help our partners and clients structure, finance, and execute complex transactions. We design tailored strategies that manage risks, ensure regulatory compliance, and deliver measurable, long-term value.",
        ],
      },
    ],
  },
  "bky-insurance-agency": {
    slug: "bky-insurance-agency",
    navLabel: "BKY INSURANCE AGENCY",
    cardName: "BKY Insurance Agency",
    pageTitle: "BKY INSURANCE AGENCY",
    logo: "/assets/companies/bky.png",
    heroImage: "/assets/companies/bky.png",
    introHeading: "WHO WE ARE",
    summary:
      "BKY Insurance Agencies is a licensed agency with IRA and an affiliate company of AVLC Group.",
    intro: [
      "BKY Insurance Agencies is a licensed agency with IRA, and is an affiliate company of AVLC Group. The strategy for BKY is differentiation and thus veers away from depending solely on offering standardized products. To this end, research, innovation and efficiency in processes are the backbone of the Agency.",
    ],
    sections: [
      {
        title: "The following feed into this strategy",
        bullets: [
          "Branding- we choose our names carefully as they are critical to the products success",
          "Targeting-insurance has largely been undifferentiated-we select our market",
          "Strategic Partnerships- these enable us concentrate on our core business",
          "Inclusivity and interactivity-our clients are engaged throughout the policy period",
          "Emotion-Empowering and positive emotion; not the traditional fire and brimstone",
          "Value Addition- this is achieved through partnerships",
          "Lifestyle based- this increases acceptance as insurance is largely sold, not bought",
        ],
      },
      {
        title: "WHO WE ARE",
        paragraphs: [
          "As an independent insurance intermediary, we help our clients find insurance solutions tailored to their individual needs. We draw from a vast pool of personal, property and commercial insurance policies therefore meeting all your insurance needs. We invite you to explore our comprehensive consulting services and get to know our competent and friendly staff. Some of the benefits accorded to our clients is a 24/7 dedicated service available on our mobile contacts and negotiated prices applied based on given parameters as well as negotiated time frame settlement and of course our customised products/policies.",
          "We advise clients on optional premium financing hence help them on realizing optimal flexibility on their budgets. Thus achieving a business ideology of paying today's benefits on tomorrow's earnings.",
          "We are happy to inform you that our cover focuses more for you than a standard insurance policy. We enhance most of the benefits to suit your needs for your car as here below as opposed to a standard Comprehensive cover policy.",
          "BKY as an institution seeks to be a beacon of fundamental change in the insurance industry. Once we have earned our name in the industry we then intend to be at the forefront of leading the way to increase insurance penetration. For now our products speak for themselves seeing as how well the market has responded to them, namely the Lifestyle Lady and Home Kuko Sawa customised policies.",
        ],
      },
    ],
  },
  instacash: {
    slug: "instacash",
    navLabel: "INSTACASH WORLDWIDE LIMITED",
    cardName: "Instacash",
    pageTitle: "INSTACASH WORLDWIDE LIMITED",
    logo: "/assets/companies/instacash.png",
    heroImage: "/assets/companies/instacash.png",
    introHeading: "WHO WE ARE",
    summary:
      "InstaCash World Wide was incorporated in 2007 in Nairobi Kenya as a constituent of AVLC group of Companies.",
    intro: [
      "InstaCash World Wide was incorporated in 2007 in Nairobi Kenya as a constituent of AVLC group of Companies, to take advantage of the lucrative money transfer market whilst also changing the way people send and receive money first in Africa and eventually globally by leveraging on Mobile Money Platforms. InstaCash is headquartered in Kenya with agent offices in South Africa, South Sudan, United Arab Emirates, Rwanda, Burundi, Uganda and Tanzania.",
      "The Vision of the company is; to be the preferred Pan African Company in money transfer solutions and related services. With a mission to offer excellent Money Transfer Solutions through strategic partnerships.",
      "InstaCash values Integrity, Professionalism, Transparency and Innovation in all its business transactions with the intention of driving the most reliable and secure money transfer service in the world.",
    ],
    sections: [
      {
        title: "OUR VISION",
        paragraphs: [
          "To be the preferred Pan African Company in money transfer solutions and related services.",
        ],
      },
      {
        title: "OUR MISSION STATEMENT",
        paragraphs: [
          "To offer excellent Money Transfer Solutions through strategic partnerships.",
        ],
      },
      {
        title: "OUR PRODUCTS",
        bullets: [
          "Money transfer solutions",
          "Related financial transfer services",
        ],
      },
    ],
  },
  "bid-bonds": {
    slug: "bid-bonds",
    navLabel: "Cash Free Bid Bonds by PSL Capital",
    cardName: "Cash Free Bid Bonds by PSL Capital",
    pageTitle: "Cash Free Bid Bonds by PSL Capital",
    logo: "/assets/companies/psl.png",
    heroImage: "/assets/companies/psl.png",
    introHeading: "Bid Bonds and Guarantee needs simplified",
    summary:
      "Bid Bonds and Guarantee needs simplified by PSL CAPITAL LIMITED, a subsidiary firm of AVLC GROUP.",
    intro: [
      "Bid Bonds and Guarantee needs simplified.",
      "Welcome to PSL CAPITAL LIMITED, (a subsidiary firm of AVLC GROUP) where we are committed to providing comprehensive bank guarantees and Bid Bonds solutions tailored to the unique needs of businesses in Kenya and Eastern Africa.",
      "Please download and fill the form below to get your Bid Bond processing easy and fast.",
      "PSL Bid Bond Request form (2022)",
    ],
    sections: [
      {
        title: "For more information or assistance, contact us",
        bullets: [
          "Email: info@avlcapital.com",
          "Phone: 020 230 4180",
        ],
      },
      {
        title: "What is a Bid Bond in Kenya?",
        paragraphs: [
          "It is a type of surety that serves as a guarantee from a bidder to a project owner (usually a government agency or private entity) that the bidder will fulfill the terms of a contract awarded. In Kenya, bid bonds hold a significant place in the procurement process, helping to safeguard the interests of government entities and private companies involved.",
        ],
      },
      {
        title: "Bid Bonds requirements.",
        paragraphs: [
          "Our team at PSL CAPITAL LIMITED understands that meeting the specific requirements for bid bonds is essential for a successful bidding process. From documentation to financial eligibility, we are here to assist you every step of the way.",
        ],
      },
      {
        title: "Bid Bonds rates.",
        paragraphs: [
          "At PSL CAPITAL LIMITED, we recognize that competitive rates are essential for your project's financial planning. With transparent pricing, you can confidently calculate the financial implications of the bid bond as you prepare your bid.",
        ],
      },
      {
        title: "Bid Bond financing.",
        paragraphs: [
          "Understanding that bid bonds often require upfront financial commitment, we offer bid bond financing options. This ensures that financial constraints don't hinder your ability to participate in competitive tenders in Kenya and Eastern Africa.",
        ],
      },
      {
        title: "Bid Bond percentage",
        paragraphs: [
          "Bid bond amounts are typically a percentage of the bid value, often ranging from 1% to 2%. This percentage showcases the bidder's commitment to the project's successful completion. The higher the percentage, the stronger the commitment.",
        ],
      },
      {
        title: "Bid Bond Example",
        paragraphs: [
          "Consider this scenario: A construction company is bidding for a government infrastructure project and to demonstrate their commitment, they provide a bid bond that acts as security and if they fail to secure the project, the bond is released. However, if they win the bid and don't fulfill their obligations, the bond is used to compensate the project owner for losses incurred.",
        ],
      },
      {
        title: "Bid Bond in a tender.",
        paragraphs: [
          "In the context of a tender, a bid bond serves as a guarantee that a bidder will proceed with the contract if awarded and it provides an assurance to the tendering authority that the bidder is credible and financially sound hence this security contributes to a fair and trustworthy tendering process.",
        ],
      },
      {
        title: "Tender security vs Bid Bond.",
        paragraphs: [
          "While both tender security and bid bonds aim to ensure bidder commitment, they have key differences. Tender security involves a monetary guarantee alongside the bid, while a bid bond on the other hand, acts as a financial commitment and is a separate instrument from the bid.",
          "Choose PSL CAPITAL LIMITED for expert guidance in bid bonds, performance bonds, and tendering excellence.",
        ],
      },
    ],
    downloadCta: {
      label: "PSL Bid Bond Request form (2022)",
      href: "/assets/documents/companies/psl-bid-bond-request-form-2022.pdf",
    },
  },
};

export const companyNavItems = Object.values(companyProfiles).map((company) => ({
  href: `/${company.slug}`,
  label: company.navLabel,
}));

export const homepageCompanies = Object.values(companyProfiles).map((company) => ({
  href: `/${company.slug}`,
  name: company.cardName,
  description: company.summary,
  logo: company.logo,
}));
