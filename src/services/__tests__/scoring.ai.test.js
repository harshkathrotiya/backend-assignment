import { jest } from '@jest/globals';

process.env.GEMINI_API_KEY = 'test-key';

jest.unstable_mockModule('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: async () => ({ response: { text: () => '{\"intent\":\"High\",\"reasoning\":\"Strong fit.\"}' } })
    })
  }))
}));

const { scoreByAI } = await import('../scoring.js');

describe('scoreByAI', () => {
  test('maps High to 50 with reasoning', async () => {
    const lead = { name: 'A', role: 'Head of Growth', company: 'X', industry: 'SaaS', location: 'NY', linkedin_bio: 'bio' };
    const offer = { name: 'Offer', value_props: [], ideal_use_cases: [], industries_icp: [], roles_decision_makers: [], roles_influencers: [] };
    const res = await scoreByAI(lead, offer);
    expect(res.intent).toBe('High');
    expect(res.points).toBe(50);
    expect(res.reasoning).toBe('Strong fit.');
  });
});
