import { scoreByRules } from './scoring.js';

const offer = {
  roles_decision_makers: ['head of growth', 'cmo'],
  roles_influencers: ['growth', 'demand gen'],
  industries_icp: ['saas', 'technology']
};

function lead(overrides) {
  return {
    name: 'Test',
    role: 'Head of Growth',
    company: 'Acme',
    industry: 'SaaS',
    location: 'NY',
    linkedin_bio: 'bio',
    ...overrides,
  };
}

console.log('Rule: DM + ICP exact + completeness => expect 50');
console.log(scoreByRules(lead({}), offer));

console.log('Rule: Influencer + ICP adjacent + completeness => expect 30');
console.log(scoreByRules(lead({ role: 'Growth Manager', industry: 'SaaS Solutions' }), offer));

console.log('Rule: No match + incomplete => expect 0');
console.log(scoreByRules(lead({ role: 'Engineer', industry: 'Healthcare', linkedin_bio: '' }), offer));


