const APPLICATIONS = [
  { group: 'CLIENT SERVICES', title: 'Talk to the house.', detail: 'Orders, fit, sizing, private shopping and general inquiries.', path: '/forms/inquiry', label: 'SEND AN INQUIRY' },
  { group: 'BUSINESS', title: 'Build with STUSH.', detail: 'Brand collaborations, placements, retail and commercial partnerships.', path: '/forms/sponsor', label: 'START A PARTNERSHIP' },
  { group: 'CREATIVE', title: 'Model for STUSH.', detail: 'Editorial, commercial, runway, lookbook and e-commerce talent.', path: '/forms/model', label: 'MODEL APPLICATION' },
  { group: 'CREATIVE', title: 'Creators and ambassadors.', detail: 'Content creators, stylists, affiliates and cultural partners.', path: '/forms/ambassador', label: 'CREATOR APPLICATION' },
  { group: 'ADDITIONAL APPLICATIONS', title: 'Event hosting.', detail: 'Host or represent a STUSH event or activation.', path: '/forms/host', label: 'HOST APPLICATION' },
  { group: 'ADDITIONAL APPLICATIONS', title: 'Podcast partnerships.', detail: 'Audio, interview, podcast and culture collaborations.', path: '/forms/podcast', label: 'PODCAST APPLICATION' },
  { group: 'ADDITIONAL APPLICATIONS', title: 'Promoters.', detail: 'Collaborate on events, drops and cultural activations.', path: '/forms/promoter', label: 'PROMOTER APPLICATION' },
];

export const metadata = {
  title: 'Contact & Applications | STUSH',
  description: 'Reach STUSH client services and find official STUSH partnership, model and creator applications.',
};

export default function StushForms() {
  return (
    <section className="stush-form-page">
      <div className="stush-form-intro">
        <span className="stush-utility-kicker">STUSH / CONTACT & APPLICATIONS</span>
        <h1>Find your way into the house.</h1>
        <p>Choose the correct destination below. All applications go to STUSH-specific intake forms.</p>
      </div>
      <div className="stush-form" id="creative">
        <div className="stush-form__grid">
          {APPLICATIONS.map(item => (
            <div key={item.path} className="stush-form__field stush-form__field--full">
              <span className="stush-utility-kicker">{item.group}</span>
              <h2>{item.title}</h2>
              <p>{item.detail}</p>
              <a className="btn-primary" href={item.path}>{item.label} →</a>
            </div>
          ))}
        </div>
        <div className="stush-form__bottom">
          <span>STUSH · ATLANTA · OFFICIAL INTAKE</span>
          <span>Submission does not guarantee acceptance or a partnership.</span>
        </div>
      </div>
    </section>
  );
}
