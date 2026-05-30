import { getUncachableStripeClient } from './stripeClient';

const BEDDING_LOGO_URL = '/assets/kk_accessories_bedding_logo.jpg';

interface BeddingUpdate {
  searchTerm: string;
  newDescription: string;
}

const beddingUpdates: BeddingUpdate[] = [
  // Khomplete Khemistri Accessories Duvet Sets
  { searchTerm: 'Khomplete Khemistri Accessories Duvet Set - Twin', newDescription: 'TW - Elegant duvet comforter set featuring the Khomplete Khemistri Accessories eagle badge. "Sleep and Dream in Luxury" - Rich burgundy brown. Includes duvet cover and 1 pillowsham. Insert not included.' },
  { searchTerm: 'Khomplete Khemistri Accessories Duvet Set - Full', newDescription: 'Ful - Elegant duvet comforter set featuring the Khomplete Khemistri Accessories eagle badge. "Sleep and Dream in Luxury" - Rich burgundy brown. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Khomplete Khemistri Accessories Duvet Set - Queen', newDescription: 'Qn - Elegant duvet comforter set featuring the Khomplete Khemistri Accessories eagle badge. "Sleep and Dream in Luxury" - Rich burgundy brown. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Khomplete Khemistri Accessories Duvet Set - King', newDescription: 'Kg - Elegant duvet comforter set featuring the Khomplete Khemistri Accessories eagle badge. "Sleep and Dream in Luxury" - Rich burgundy brown. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Khomplete Khemistri Accessories Duvet Set - California King', newDescription: 'Cali. Kg - Elegant duvet comforter set featuring the Khomplete Khemistri Accessories eagle badge. "Sleep and Dream in Luxury" - Rich burgundy brown. Includes duvet cover and 2 pillowshams. Insert not included.' },
  
  // Khomplete Khemistri Accessories Fleece Blankets
  { searchTerm: 'Khomplete Khemistri Accessories Fleece Blanket - Twin', newDescription: 'TW (60" x 80") - Plush fleece throw blanket featuring the Khomplete Khemistri Accessories eagle badge. "Sleep and Dream in Luxury" - Deep burgundy brown. Soft and cozy for bed or couch.' },
  { searchTerm: 'Khomplete Khemistri Accessories Fleece Blanket - Full/Queen', newDescription: 'Ful/Qn (80" x 90") - Plush fleece throw blanket featuring the Khomplete Khemistri Accessories eagle badge. "Sleep and Dream in Luxury" - Deep burgundy brown. Soft and cozy for bed or couch.' },
  { searchTerm: 'Khomplete Khemistri Accessories Fleece Blanket - King', newDescription: 'Kg (90" x 100") - Plush fleece throw blanket featuring the Khomplete Khemistri Accessories eagle badge. "Sleep and Dream in Luxury" - Deep burgundy brown. Soft and cozy for bed or couch.' },
  
  // Plain Duvet Sets
  { searchTerm: 'Duvet Comforter Set - Twin', newDescription: 'TW - Elegant duvet comforter set in rich burgundy brown. Premium microfiber fabric with button closure. Includes duvet cover and 1 pillowsham. Insert not included.' },
  { searchTerm: 'Duvet Comforter Set - Full', newDescription: 'Ful - Elegant duvet comforter set in rich burgundy brown. Premium microfiber fabric with button closure. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Duvet Comforter Set - Queen', newDescription: 'Qn - Elegant duvet comforter set in rich burgundy brown. Premium microfiber fabric with button closure. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Duvet Comforter Set - King', newDescription: 'Kg - Elegant duvet comforter set in rich burgundy brown. Premium microfiber fabric with button closure. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Duvet Comforter Set - California King', newDescription: 'Cali. Kg - Elegant duvet comforter set in rich burgundy brown. Premium microfiber fabric with button closure. Includes duvet cover and 2 pillowshams. Insert not included.' },
  
  // Khemistri Duvet Sets (logo embroidered)
  { searchTerm: 'Khemistri Duvet Comforter Set - Twin', newDescription: 'TW - Elegant duvet comforter set with Khomplete Khemistri Accessories logo embroidered at foot. "Sleep and Dream in Luxury" - Rich burgundy brown with gold crest. Includes duvet cover and 1 pillowsham. Insert not included.' },
  { searchTerm: 'Khemistri Duvet Comforter Set - Full', newDescription: 'Ful - Elegant duvet comforter set with Khomplete Khemistri Accessories logo embroidered at foot. "Sleep and Dream in Luxury" - Rich burgundy brown with gold crest. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Khemistri Duvet Comforter Set - Queen', newDescription: 'Qn - Elegant duvet comforter set with Khomplete Khemistri Accessories logo embroidered at foot. "Sleep and Dream in Luxury" - Rich burgundy brown with gold crest. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Khemistri Duvet Comforter Set - King', newDescription: 'Kg - Elegant duvet comforter set with Khomplete Khemistri Accessories logo embroidered at foot. "Sleep and Dream in Luxury" - Rich burgundy brown with gold crest. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Khemistri Duvet Comforter Set - California King', newDescription: 'Cali. Kg - Elegant duvet comforter set with Khomplete Khemistri Accessories logo embroidered at foot. "Sleep and Dream in Luxury" - Rich burgundy brown with gold crest. Includes duvet cover and 2 pillowshams. Insert not included.' },
  
  // Khemistri Fleece Blankets
  { searchTerm: 'Khemistri Fleece Blanket - Twin', newDescription: 'TW (60" x 80") - Plush fleece throw blanket with Khomplete Khemistri Accessories logo in center. "Sleep and Dream in Luxury" - Deep burgundy brown with gold crest. Soft and cozy for bed or couch.' },
  { searchTerm: 'Khemistri Fleece Blanket - Full/Queen', newDescription: 'Ful/Qn (80" x 90") - Plush fleece throw blanket with Khomplete Khemistri Accessories logo in center. "Sleep and Dream in Luxury" - Deep burgundy brown with gold crest. Soft and cozy for bed or couch.' },
  { searchTerm: 'Khemistri Fleece Blanket - King', newDescription: 'Kg (90" x 100") - Plush fleece throw blanket with Khomplete Khemistri Accessories logo in center. "Sleep and Dream in Luxury" - Deep burgundy brown with gold crest. Soft and cozy for bed or couch.' },
  
  // Logo Duvet Sets
  { searchTerm: 'Logo Duvet Comforter Set - Twin', newDescription: 'TW - Elegant duvet comforter set with Khomplete Khemistri Accessories logo embroidered at foot. "Sleep and Dream in Luxury" - Rich burgundy brown with gold crest. Includes duvet cover and 1 pillowsham. Insert not included.' },
  { searchTerm: 'Logo Duvet Comforter Set - Full', newDescription: 'Ful - Elegant duvet comforter set with Khomplete Khemistri Accessories logo embroidered at foot. "Sleep and Dream in Luxury" - Rich burgundy brown with gold crest. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Logo Duvet Comforter Set - Queen', newDescription: 'Qn - Elegant duvet comforter set with Khomplete Khemistri Accessories logo embroidered at foot. "Sleep and Dream in Luxury" - Rich burgundy brown with gold crest. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Logo Duvet Comforter Set - King', newDescription: 'Kg - Elegant duvet comforter set with Khomplete Khemistri Accessories logo embroidered at foot. "Sleep and Dream in Luxury" - Rich burgundy brown with gold crest. Includes duvet cover and 2 pillowshams. Insert not included.' },
  { searchTerm: 'Logo Duvet Comforter Set - California King', newDescription: 'Cali. Kg - Elegant duvet comforter set with Khomplete Khemistri Accessories logo embroidered at foot. "Sleep and Dream in Luxury" - Rich burgundy brown with gold crest. Includes duvet cover and 2 pillowshams. Insert not included.' },
  
  // Logo Fleece Blankets
  { searchTerm: 'Logo Fleece Blanket - Twin', newDescription: 'TW (60" x 80") - Plush fleece throw blanket with Khomplete Khemistri Accessories logo in center. "Sleep and Dream in Luxury" - Deep burgundy brown with gold crest. Soft and cozy for bed or couch.' },
  { searchTerm: 'Logo Fleece Blanket - Full/Queen', newDescription: 'Ful/Qn (80" x 90") - Plush fleece throw blanket with Khomplete Khemistri Accessories logo in center. "Sleep and Dream in Luxury" - Deep burgundy brown with gold crest. Soft and cozy for bed or couch.' },
  { searchTerm: 'Logo Fleece Blanket - King', newDescription: 'Kg (90" x 100") - Plush fleece throw blanket with Khomplete Khemistri Accessories logo in center. "Sleep and Dream in Luxury" - Deep burgundy brown with gold crest. Soft and cozy for bed or couch.' },
  
  // Plain Fleece Blankets
  { searchTerm: 'Plush Fleece Blanket - Twin', newDescription: 'TW (60" x 80") - Ultra-soft plush fleece blanket in deep burgundy brown. Cozy and warm for bed or couch. Machine washable.' },
  { searchTerm: 'Plush Fleece Blanket - Full/Queen', newDescription: 'Ful/Qn (80" x 90") - Ultra-soft plush fleece blanket in deep burgundy brown. Cozy and warm for bed or couch. Machine washable.' },
  { searchTerm: 'Plush Fleece Blanket - King', newDescription: 'Kg (90" x 100") - Ultra-soft plush fleece blanket in deep burgundy brown. Cozy and warm for bed or couch. Machine washable.' },
];

async function updateBeddingProducts() {
  console.log('Updating bedding product descriptions and images in Stripe...');
  const stripe = await getUncachableStripeClient();
  
  let updated = 0;
  let notFound = 0;

  for (const update of beddingUpdates) {
    try {
      const products = await stripe.products.search({
        query: `name:'${update.searchTerm}'`,
      });

      if (products.data.length > 0) {
        const product = products.data[0];
        await stripe.products.update(product.id, {
          description: update.newDescription,
          metadata: {
            ...product.metadata,
            imageUrl: BEDDING_LOGO_URL,
          },
        });
        console.log(`Updated: ${update.searchTerm}`);
        updated++;
      } else {
        console.log(`Not found: ${update.searchTerm}`);
        notFound++;
      }
    } catch (error) {
      console.error(`Error updating ${update.searchTerm}:`, error);
    }
  }

  console.log(`\nComplete! Updated: ${updated}, Not found: ${notFound}`);
  process.exit(0);
}

updateBeddingProducts().catch((error) => {
  console.error('Error updating bedding products:', error);
  process.exit(1);
});
