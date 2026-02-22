import type { TopicInput } from '../backend';

const categories = ['AI', 'Technology', 'Sports', 'Entertainment', 'Politics', 'Science', 'Business', 'Health', 'Gaming', 'Fashion'];
const trendIndicators = ['hot', 'rising', 'stable'];

const topicTemplates = [
  { title: 'AI Revolution in Healthcare', category: 'AI' },
  { title: 'Quantum Computing Breakthrough', category: 'Technology' },
  { title: 'Olympic Games 2025 Highlights', category: 'Sports' },
  { title: 'New Streaming Platform Launch', category: 'Entertainment' },
  { title: 'Climate Policy Changes', category: 'Politics' },
  { title: 'Mars Mission Update', category: 'Science' },
  { title: 'Cryptocurrency Market Surge', category: 'Business' },
  { title: 'Mental Health Awareness Campaign', category: 'Health' },
  { title: 'Next-Gen Gaming Console', category: 'Gaming' },
  { title: 'Sustainable Fashion Trends', category: 'Fashion' },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateParagraph(type: 'overview' | 'trending' | 'facts' | 'outlook', topic: string): string {
  const templates = {
    overview: [
      `${topic} represents a significant development in its field, capturing widespread attention across multiple platforms. This emerging trend has gained momentum through social media discussions, news coverage, and expert analysis. The topic encompasses various aspects that have resonated with diverse audiences, from industry professionals to casual observers.`,
      `The phenomenon of ${topic} has emerged as a focal point of contemporary discourse, drawing interest from various sectors. This trend reflects broader shifts in public consciousness and technological advancement. Its multifaceted nature allows for diverse interpretations and applications across different contexts.`,
      `${topic} has become a defining subject of current conversations, representing a convergence of innovation, public interest, and cultural relevance. The topic's emergence signals important changes in how we approach related challenges and opportunities. Its significance extends beyond immediate applications to broader implications.`,
    ],
    trending: [
      `The surge in interest around ${topic} can be attributed to recent developments that have captured public imagination. Social media platforms have amplified discussions, with influencers and thought leaders contributing to the conversation. News outlets have provided extensive coverage, highlighting the topic's relevance to current events and future implications.`,
      `${topic} is trending due to a perfect storm of factors including technological breakthroughs, cultural shifts, and timely relevance. The topic has gained traction through viral content, expert endorsements, and grassroots movements. Its momentum continues to build as more people discover its significance and share their perspectives.`,
      `The trending status of ${topic} reflects its resonance with contemporary concerns and aspirations. Recent events have brought the subject into sharp focus, prompting widespread discussion and debate. Media coverage has intensified, with multiple outlets exploring different angles and implications of this developing story.`,
    ],
    facts: [
      `Key data points reveal the scope and impact of ${topic}. Industry reports indicate significant growth metrics, with engagement rates exceeding previous benchmarks. Research studies have documented measurable effects across various demographics. Statistical analysis shows consistent patterns that validate the trend's authenticity and staying power.`,
      `Quantitative analysis of ${topic} demonstrates its substantial reach and influence. Market research firms have tracked impressive adoption rates and user engagement metrics. Survey data reveals strong sentiment indicators across multiple age groups and geographic regions. These findings underscore the topic's broad appeal and practical relevance.`,
      `Evidence supporting the significance of ${topic} includes robust data from multiple sources. Analytics platforms report unprecedented levels of search interest and social media mentions. Academic research has begun to examine the phenomenon, with preliminary findings suggesting long-term implications. Industry experts cite specific metrics that highlight the trend's momentum.`,
    ],
    outlook: [
      `Looking ahead, ${topic} is positioned to evolve and expand its influence. Experts predict continued growth as more stakeholders recognize its value and potential applications. Future developments may include technological enhancements, policy changes, and broader adoption across sectors. Staying informed about this trend will be crucial for those seeking to leverage its opportunities.`,
      `The future trajectory of ${topic} appears promising, with multiple pathways for development and innovation. Industry leaders are investing resources to capitalize on emerging opportunities. As the trend matures, we can expect refinements in approach and implementation. Those who engage with this topic now will be well-positioned for future advantages.`,
      `${topic} represents not just a current trend but a potential paradigm shift with lasting implications. Forward-thinking organizations are already adapting their strategies to align with this development. The coming months will likely bring new insights and applications. Monitoring this space closely will be essential for staying ahead of the curve.`,
    ],
  };

  const options = templates[type];
  return options[Math.floor(Math.random() * options.length)];
}

function generateSources(): string[] {
  const sources = [
    'https://example.com/source1',
    'https://example.com/source2',
    'https://example.com/source3',
    'https://example.com/research',
    'https://example.com/analysis',
  ];
  const count = Math.floor(Math.random() * 3) + 1;
  return sources.slice(0, count);
}

function generateRelatedQueries(topic: string): string[] {
  const queries = [
    `${topic} explained`,
    `${topic} trends 2025`,
    `${topic} impact`,
    `${topic} future`,
    `${topic} analysis`,
    `${topic} statistics`,
  ];
  const count = Math.floor(Math.random() * 4) + 3;
  return queries.slice(0, count);
}

export function generateMockTopics(count: number): TopicInput[] {
  const topics: TopicInput[] = [];

  for (let i = 0; i < count; i++) {
    const template = topicTemplates[i % topicTemplates.length];
    const uniqueTitle = `${template.title} ${Math.floor(Math.random() * 1000)}`;
    const category = template.category;
    const score = Math.floor(Math.random() * 900) + 100;
    const polygonVertices = Math.min(12, Math.max(3, Math.floor(score / 100) + 3));
    const trendIndicator = trendIndicators[Math.floor(Math.random() * trendIndicators.length)];

    const topic: TopicInput = {
      title: uniqueTitle,
      slug: generateSlug(uniqueTitle),
      category,
      score: BigInt(score),
      paragraphs: [
        {
          content: generateParagraph('overview', uniqueTitle),
          sources: generateSources(),
        },
        {
          content: generateParagraph('trending', uniqueTitle),
          sources: generateSources(),
        },
        {
          content: generateParagraph('facts', uniqueTitle),
          sources: generateSources(),
        },
        {
          content: generateParagraph('outlook', uniqueTitle),
          sources: generateSources(),
        },
      ],
      relatedQueries: generateRelatedQueries(uniqueTitle),
      trendIndicator,
      polygonVertices: BigInt(polygonVertices),
    };

    topics.push(topic);
  }

  return topics;
}
