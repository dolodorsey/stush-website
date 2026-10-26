const DIVISIONS = [
  {
    id: 'client-services',
    index: '01',
    name: 'CLIENT SERVICES',
    heading: 'For the customer.',
    introduction: 'Questions about your order, fit, sizing or private shopping.',
    opportunities: [
      { code: '01.01', title: 'Client Services', description: 'Orders, product questions, private appointments and general support.', href: '/forms/inquiry', action: 'CONTACT THE HOUSE' },
    ],
  },
  {
    id: 'creative',
    index: '02',
    name: 'THE CREATIVE DIVISION',
    heading: 'For the culture.',
    introduction: 'Casting, campaigns, experiences and the people who shape them.',
    opportunities: [
      { code: '02.01', title: 'Model Casting', description: 'Editorial, e-commerce, runway and campaign talent.', href: '/forms/model', action: 'APPLY NOW' },
      { code: '02.02', title: 'Creators & Ambassadors', description: 'Creators, stylists, affiliates and long-term collaborators.', href: '/forms/ambassador', action: 'APPLY NOW' },
      { code: '02.03', title: 'Event Hosts', description: 'Hosts and personalities for STUSH experiences.', href: '/forms/host', action: 'APPLY NOW' },
      { code: '02.04', title: 'Promoters', description: 'Culture movers and event promotion partners.', href: '/forms/promoter', action: 'APPLY NOW' },
      { code: '02.05', title: 'Podcast & Media', description: 'Podcast appearances and editorial collaborations.', href: '/forms/podcast', action: 'SUBMIT A PROPOSAL' },
    ],
  },
  {
    id: 'partnerships',
    index: '03',
    name: 'BUSINESS & PARTNERSHIPS',
    heading: 'For what comes next.',
    introduction: 'Build a commercial relationship with the house.',
    opportunities: [
      { code: '03.01', title: 'Brand Partnerships', description: 'Commercial collaborations, retail and campaign partnerships.', href: '/forms/sponsor', action: 'START A CONVERSATION' },
      { code: '03.02', title: 'NDA / Document Intake', description: 'Confidentiality and partner document intake.', href: '/forms/nda', action: 'OPEN INTAKE' },
    ],
  },
];

export const metadata = {
  title: 'The House — Applications & Contact | STUSH',
  description: 'STUSH official client services, model casting, creator applications and business partnerships.',
};

export default function StushForms() {
  return (
    <section className="stush-intake" data-qa="stush-intake-directory">
      <header className="stush-intake__hero">
        <div className="stush-intake__topline">
          <span>STUSH / THE HOUSE</span>
          <span>ATLANTA · WORLDWIDE</span>
        </div>
        <div className="stush-intake__hero-layout">
          <div>
            <p className="stush-intake__edition">APPLICATIONS <span aria-hidden="true">/</span> CONTACT <span aria-hidden="true">/</span> PARTNERSHIPS</p>
            <h1>Enter the <em>house.</em></h1>
          </div>
          <div className="stush-intake__hero-aside">
            <span className="stush-intake__redline" aria-hidden="true" />
            <p>Model. Create. Collaborate. Get support.</p>
            <p className="stush-intake__hero-muted">The right conversation starts in the right place. Select an opportunity below.</p>
          </div>
        </div>
        <nav className="stush-intake__jump" aria-label="Application sections">
          <a href="#client-services"><span>01</span> CLIENT SERVICES</a>
          <a href="#creative"><span>02</span> CREATIVE</a>
          <a href="#partnerships"><span>03</span> PARTNERSHIPS</a>
        </nav>
      </header>

      <div className="stush-intake__paper">
        <div className="stush-intake__paper-head">
          <span>THE DIRECTORY</span>
          <span>08 WAYS TO CONNECT</span>
        </div>
        {DIVISIONS.map(division => (
          <section className="stush-intake__division" id={division.id} key={division.id} aria-labelledby={`heading-${division.id}`}>
            <div className="stush-intake__division-heading">
              <div className="stush-intake__division-num" aria-hidden="true">{division.index}</div>
              <div className="stush-intake__division-copy">
                <span className="stush-intake__kicker">{division.name}</span>
                <h2 id={`heading-${division.id}`}>{division.heading}</h2>
              </div>
              <p className="stush-intake__division-note">{division.introduction}</p>
            </div>
            <div className="stush-intake__entries">
              {division.opportunities.map(item => (
                <a className="stush-intake__entry" href={item.href} key={item.href} data-stush-intake-path={item.href}>
                  <span className="stush-intake__entry-code" aria-hidden="true">{item.code}</span>
                  <span className="stush-intake__entry-main">
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </span>
                  <span className="stush-intake__entry-action" aria-hidden="true">{item.action}</span>
                  <span className="stush-intake__entry-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>
        ))}
        <footer className="stush-intake__footnote">
          <span>STUSH — DRESSED FOR THE ROOM.</span>
          <span>All applications are reviewed individually. Submission does not guarantee acceptance, payment or a partnership.</span>
        </footer>
      </div>
    </section>
  );
}
