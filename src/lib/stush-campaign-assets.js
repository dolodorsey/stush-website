// STUSH campaign asset registry — approved editorial/brand imagery only.
// Commerce/product cards must continue to use live Shopify product media.

export const STUSH_CAMPAIGN = {
  courtGreenJersey: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-campaign-court-green-jersey.png?v=1789376857',
    alt: 'STUSH green jersey campaign portrait on a basketball court',
  },
  brownstoneGraphicTee: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-campaign-brownstone-graphic-tee.png?v=1789376871',
    alt: 'STUSH graphic tee campaign portrait on brownstone steps',
  },
  burgundyPolo: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-campaign-burgundy-polo.png?v=1789376881',
    alt: 'STUSH burgundy polo campaign portrait',
  },
  wardrobeRack: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-campaign-wardrobe-rack.png?v=1789376893',
    alt: 'STUSH wardrobe rack campaign still',
  },
  rooftopBlackJersey: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-campaign-rooftop-black-jersey.png?v=1789376902',
    alt: 'STUSH black jersey rooftop campaign portrait',
  },
  cafeCreamJersey: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-campaign-cafe-cream-jersey.png?v=1789376915',
    alt: 'STUSH cream jersey cafe campaign portrait',
  },
  brownstoneMonogramTee: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-campaign-brownstone-monogram-tee.png?v=1789376932',
    alt: 'STUSH black monogram tee campaign portrait',
  },
  blackMonogramStillLife: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-campaign-black-monogram-still-life.png?v=1789376941',
    alt: 'STUSH black monogram tee still life',
  },
};

export const STUSH_HOUSE_WORLD = {
  crystal: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-house-crystal-world.png?v=1789376954',
    alt: 'STUSH crystal and black satin house artwork',
  },
  roses: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-house-black-roses-marble.png?v=1789376963',
    alt: 'STUSH black roses and marble house artwork',
  },
  chrome: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-house-chrome-satin.png?v=1789376972',
    alt: 'STUSH chrome and satin house artwork',
  },
  rainyBoutique: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-house-rainy-boutique.png?v=1789376984',
    alt: 'STUSH rainy nighttime boutique concept artwork',
  },
  dressingRoom: {
    src: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/stush-house-private-dressing-room.png?v=1789376995',
    alt: 'STUSH private dressing room concept artwork',
  },
};

export const STUSH_CATEGORY_CAMPAIGN = {
  essentials: STUSH_CAMPAIGN.blackMonogramStillLife,
  women: STUSH_CAMPAIGN.cafeCreamJersey,
  outerwear: STUSH_CAMPAIGN.wardrobeRack,
  hoodies: STUSH_CAMPAIGN.brownstoneMonogramTee,
  jerseys: STUSH_CAMPAIGN.courtGreenJersey,
  tops: STUSH_CAMPAIGN.brownstoneGraphicTee,
  bottoms: STUSH_CAMPAIGN.rooftopBlackJersey,
  accessories: STUSH_HOUSE_WORLD.chrome,
};

export const STUSH_LOOKBOOK_SEQUENCE = [
  STUSH_CAMPAIGN.courtGreenJersey,
  STUSH_CAMPAIGN.cafeCreamJersey,
  STUSH_CAMPAIGN.brownstoneGraphicTee,
  STUSH_CAMPAIGN.burgundyPolo,
  STUSH_CAMPAIGN.rooftopBlackJersey,
  STUSH_CAMPAIGN.brownstoneMonogramTee,
  STUSH_CAMPAIGN.wardrobeRack,
  STUSH_CAMPAIGN.blackMonogramStillLife,
];
