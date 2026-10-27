const projectsData = [
  {
    title: 'Economist Intelligence 75th Birthday',
    description: `A microsite for The Economist Intelligence 75th anniversary. I worked directly with the designer, strategist, and client to design and develop a unique one-off site.`,
    imgSrc: '/static/images/projects/economist.webp',
    href: 'https://www.youtube.com/watch?v=-hYjk9hpWWo',
  },
  {
    title: 'Language Learning with Video App',
    description: `A Strapi and Next.js application with scraping, fuzzy search, and a custom video player. Its features include JWT OAuth, fuzzy search, and a daily cron job to mirror existing databases and images.`,
    imgSrc: '/static/images/projects/language_learning.webp',
    href: 'https://youtu.be/2vUus1VzEyE',
  },
  {
    title: 'Socket.IO Real-time Game',
    description: `An application for students to watch and interact with films in real time and for teachers to control the film and see results at the end. The application heavily uses WebSockets and is animated with Framer Motion.`,
    imgSrc: '/static/images/projects/game.webp',
    href: 'https://youtu.be/c3r1glqMMsU',
  },
  {
    title: 'News Feed Scrapping and Summarising',
    description: `Full stack next.js application with a daily cron job to scrape, summarise and tag web development blog posts. Uses fuzzy search directly in mysql for fast searching.`,
    imgSrc: '/static/images/projects/fastfeed.webp',
    href: 'https://github.com/robsutcliffe/in_tech_today',
  },
  {
    title: 'AI Treemap Generator',
    description: `Use various AI models to categories open ended survey responses and check with a the user at various stages if the categories are useful and accurate.`,
    imgSrc: '/static/images/projects/survey.webp',
    href: 'https://youtu.be/aAZPw7p2GbI',
  },
  {
    title: 'Layer Health Inspector',
    description: `An interactive scree plot tool for exploring potential savings at each layer of a neural network. Click a layer, drag the red slider to a node count you are considering, and see the estimated compute savings and risk level — designed to be understood by non-technical stakeholders.`,
    imgSrc: '/static/images/projects/layer-health-inspector.webp',
    href: '/projects/layer-health-inspector',
  },
  {
    title: 'Training Stability Meter',
    description: `An interactive tool for visualising neural network training stability — read the loss landscape and diagnose instability phenomena such as exploding gradients, saddle points, and loss barriers.`,
    imgSrc: '',
    href: '/projects/training-stability-meter',
  },
  {
    title: 'Benefit Decision Waterfall',
    description: `An interactive SHAP waterfall explainer for algorithmic benefit eligibility. Explore step-by-step contributions of household demographics, income levels, and assistance programs toward or away from SNAP approval.`,
    imgSrc: '',
    href: '/projects/benefit-decision-waterfall',
  },
  {
    title: 'Paragraph Embedding Explorer',
    description: `An interactive PCA map showing how individual paragraphs of a multi-topic article embed differently. Select a paragraph to highlight its nearest neighbours across editorial sections — revealing whether a single article can recommend via more than one topic.`,
    imgSrc: '',
    href: '/projects/paragraph-embedding-explorer',
  },
  {
    title: 'Embedding Space Explorer',
    description: `An interactive PCA map of a local-news article corpus coloured by editorial section. Hover any article to draw lines to its three nearest neighbours in the original embedding space — and spot cross-section connections where the embeddings disagree with editorial labels.`,
    imgSrc: '',
    href: '/projects/embedding-space-explorer',
  },
  {
    title: 'Ranking Signal Mixer',
    description: `Combine meaning, location and timing scores with adjustable weights to re-rank article recommendations. The semantic map never moves — only the ranked list changes — showing how non-semantic signals shift the final order without altering the embedding space.`,
    imgSrc: '',
    href: '/projects/ranking-signal-mixer',
  },
]

export default projectsData
