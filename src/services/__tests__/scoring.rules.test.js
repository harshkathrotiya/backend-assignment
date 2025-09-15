import { scoreByRules } from '../scoring.js';

describe('scoreByRules', () => {
  const offer = {
    roles_decision_makers: ['head of growth','cmo'],
    roles_influencers: ['growth','demand gen'],
    industries_icp: ['saas','technology']
  };

  const baseLead = {
    name: 'Test', role: 'Head of Growth', company: 'Acme', industry: 'SaaS', location: 'NY', linkedin_bio: 'bio'
  };

  test('decision maker + exact ICP + completeness = 50', () => {
    expect(scoreByRules(baseLead, offer)).toBe(50);
  });

  test('influencer + adjacent ICP + completeness = 30', () => {
    const lead = { ...baseLead, role: 'Growth Manager', industry: 'SaaS Solutions' };
    expect(scoreByRules(lead, offer)).toBe(30);
  });

  test('no match + incomplete = 0', () => {
    const lead = { ...baseLead, role: 'Engineer', industry: 'Healthcare', linkedin_bio: '' };
    expect(scoreByRules(lead, offer)).toBe(0);
  });
});
