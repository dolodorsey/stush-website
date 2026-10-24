export const metadata = {
  title: 'Creative Partnerships | STUSH',
  description: 'STUSH model casting and creator partnership applications.',
};

const applications = [
  {
    eyebrow: 'STUSH / MODEL CASTING',
    title: 'Model with the house.',
    description: 'For commercial, print, runway, lookbook and e-commerce talent. Submit your portfolio through the active STUSH model intake.',
    url: 'https://apply.stushusa.com/f/stush/model',
    cta: 'Apply as a model',
  },
  {
    eyebrow: 'STUSH / CREATORS & AMBASSADORS',
    title: 'Create with STUSH.',
    description: 'For creators, stylists and cultural partners interested in ongoing STUSH collaborations. Use the dedicated creator / ambassador intake.',
    url: 'https://apply.stushusa.com/f/stush/ambassador',
    cta: 'Apply as a creator',
  },
];

export default function CreativePartnerships() {
  return (
    <section className="stush-form-page">
      <div className="stush-form-intro" data-stush-reveal>
        <span className="stush-utility-kicker">STUSH / CREATIVE PARTNERSHIPS</span>
        <h1>Enter the STUSH world.</h1>
        <p>Choose the right application for your work. Each route goes to the current STUSH-specific intake, not the retired submission webhook.</p>
        <div className="stush-form-switcher">
          <a href="/forms/inquiry">Client services</a>
          <a className="is-active" href="/forms/influencer" aria-current="page">Creative partnerships</a>
          <a href="/forms/sponsor">Brand partnerships</a>
        </div>
      </div>
      <div className="stush-form" data-stush-reveal>
        <div className="stush-form__grid">
          {applications.map((application) => (
            <div className="stush-form__field stush-form__field--full" key={application.url}>
              <span className="stush-utility-kicker">{application.eyebrow}</span>
              <h2>{application.title}</h2>
              <p>{application.description}</p>
              <a className="btn-primary" href={application.url}>{application.cta}</a>
            </div>
          ))}
        </div>
        <div className="stush-form__bottom">
          <span>STUSH · ATLANTA · CREATIVE OPPORTUNITIES</span>
          <span>Submission does not guarantee selection, payment or a partnership.</span>
        </div>
      </div>
    </section>
  );
}
