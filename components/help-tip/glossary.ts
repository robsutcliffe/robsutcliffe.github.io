// Plain-language definitions for the terms shown in the UI, kept in one place so
// every "?" tooltip stays consistent. Written for a non-technical reader — no ML
// jargon, and no promises of zero quality loss.

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const GLOSSARY = {
  liveDirections: {
    term: "Live directions",
    definition:
      "How many independent patterns the layer actually relies on — the tall bars on the left, up to the faint “live” marker on the chart. The rest add little, so this is the real amount of work the layer does.",
  },
  redundantCapacity: {
    term: "Redundant capacity",
    definition:
      "The width the layer reserves but barely uses: its total width minus its live directions. A rough sign of how much room there may be to shrink.",
  },
  compressionOpportunity: {
    term: "Compression opportunity",
    definition:
      "Roughly how much smaller this layer could get at the recommended test width, as a share of its current width. Higher means more potential savings to test.",
  },
  conservativeTarget: {
    term: "Conservative target",
    definition:
      "A cautious width to try first. It keeps comfortable headroom above the live directions — lower risk, but smaller savings.",
  },
  aggressiveTarget: {
    term: "Aggressive target",
    definition:
      "A tighter width to try if the conservative one holds up. Bigger savings, but it leaves less margin, so more risk.",
  },
  risk: {
    term: "Risk",
    definition:
      "How likely shrinking to the recommended width is to affect quality — based on how much headroom is left above the live directions and how large the cut is. Always validate before shipping.",
  },
  recommendedTestWidth: {
    term: "Recommended test width",
    definition:
      "The width we suggest testing first — the best balance of savings and safety for this layer.",
  },
  rankedDirections: {
    term: "Ranked information directions",
    definition:
      "Each bar is one pattern the layer can represent, ordered strongest to weakest. Tall bars carry real information (live); short bars below the line add little (redundant). These are patterns, not individual neurons.",
  },
  testWidth: {
    term: "Test width",
    definition:
      "Preview shrinking this layer to a chosen width by keeping only its strongest directions. It starts at the recommended width; drag to try others. The chart greys out what would be trimmed.",
  },
  potentialSavings: {
    term: "Potential savings",
    definition:
      "Estimated reduction in this model's weights if every flagged layer is resized to its recommended width. A planning estimate — validate before shipping, and expect some change in quality.",
  },
  stretchSavings: {
    term: "Stretch savings",
    definition:
      "The larger estimated saving if the tighter (aggressive) targets also hold up in testing. More reward, more risk.",
  },
  layersToTest: {
    term: "Layers to test",
    definition:
      "How many layers show enough redundant capacity to be worth testing a smaller width. The rest are best left at their current width.",
  },
  biggestOpportunity: {
    term: "Biggest opportunity",
    definition:
      "The single layer with the most to gain from shrinking — a good place to start testing.",
  },
  overview: {
    term: "Model overview",
    definition:
      "Each block is a layer, in order from input to output. Block height shows the layer's width; its color shows the compression opportunity. Click a block to see its details.",
  },
  layerType: {
    term: "Layer type",
    definition:
      "The kind of computation the layer does (for engineers). It doesn't change how you read the recommendation.",
  },
} as const;

export type GlossaryKey = keyof typeof GLOSSARY;
