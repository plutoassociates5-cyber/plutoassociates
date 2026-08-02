const S = (category, question, answer, keywords) => ({
  category, question, answer,
  keywords: keywords.split('|').map((k) => k.trim()).filter(Boolean),
});

export const ipPropertySeed = [
  S('intellectual-property',
    'How do I register a trademark in Nepal and how long does it take?',
    'A trademark is registered in Nepal through an application at the Department of Industry (DoI), which examines the mark before registration. The process includes a search for earlier identical or similar marks, the filing of the application, examination and, once accepted, registration with periodic renewal. The timeline is set by the examination process and the renewal cycle, so it is not something to quote as a fixed number; what speeds or delays it is the completeness of the filing and any objections. Registering a used online brand is important because an unregistered mark gives limited protection. We handle the search, filing and follow‑up so your mark proceeds smoothly.',
    'trademark registration nepal|how long does trademark take nepal|register a trademark'),
  S('intellectual-property',
    'What is the difference between a trademark and copyright in Nepal?',
    'A trademark protects a brand identifier such as a name, logo or tagline that distinguishes your goods or services in the market, and it is obtained by registration with the concerned authority. Copyright protects creative expression such as written text, images, software code, music and films, and in Nepal it generally subsists automatically upon creation, without an application, though registration and deposit can help prove ownership and enforce rights. The practical question is which asset you are protecting: a trademark for your brand name, copyright for your original creative work. Understanding the difference decides the right route. We advise on the protection that fits each asset and the record you should hold to enforce it.',
    'trademark vs copyright nepal|difference trademark copyright|protect a brand'),
  S('technology',
    'Do I need a data protection policy for my website or business in Nepal?',
    'If you collect personal data from customers, employees or users, you should have a clear data protection policy in Nepal. It informs people what you collect, why, how it is kept and their rights, and it helps you stay consistent as the data‑protection framework in Nepal continues to grow. A plain policy also stops the common practice of collecting more data than the business needs. Customers and business partners increasingly look for even a basic policy, so it doubles as trust. We draft privacy notices and data‑use wording that fit the scale of your business, and can review your data handling so you collect and keep only what you genuinely need to.',
    'data protection policy nepal|privacy policy business|gdpr nepal equivalent'),
  S('property',
    'How can I verify land ownership before buying property in Nepal?',
    'Before you buy property in Nepal, you should verify the ownership title, the chain of previous owners, the land type and use, whether the land is free from claims or encumbrances, and the conditions that affect the transfer in the district where the land is recorded. This is usually done by inspecting the title record and related land-office records. Buying on appearance or a seller signed statement is the classic source of later disputes, because a claim or an older transfer chain can emerge years later. We conduct property due diligence that confirms the title picture before you pay, so you buy what you expect and avoid costly surprises later.',
    'verify land ownership in nepal|property due diligence nepal|check land title before buying'),
  S('property',
    'What does due diligence on a property deal cover?',
    'Due diligence on a property deal covers the legal and factual health of what you are about to buy: the title and the seller right to sell, the accuracy of the boundary, any claim or encumbrance on the land, the applicable use and zoning, any outstanding statutory issue that affects the deal, and the taxes associated with registration. It is the difference between buying a property and buying the risk attached to it. A commercial property or a larger transaction, in particular, is nearly always closed on the basis of a clean diligence report. We prepare and review this diligence so you proceed only when you understand what you are buying.',
    'property due diligence nepal|commercial property due diligence|land due diligence kathmandu'),
];