import { getUncachableStripeClient } from './stripeClient';

const APPAREL_LOGO_URL = '/assets/kk_apparel_full_name_logo.jpg';
const BEDDING_LOGO_URL = '/assets/kk_accessories_bedding_logo.jpg';

async function updateProducts() {
  console.log('Updating product images in Stripe...');
  const stripe = await getUncachableStripeClient();
  
  let updated = 0;

  // Update sweatpants
  console.log('\n--- Updating Sweatpants ---');
  const sweatpants = await stripe.products.search({
    query: `name~'Sweatpants'`,
  });
  
  for (const product of sweatpants.data) {
    await stripe.products.update(product.id, {
      metadata: {
        ...product.metadata,
        imageUrl: APPAREL_LOGO_URL,
      },
    });
    console.log(`Updated: ${product.name}`);
    updated++;
  }

  // Update all bedding products to use the correctly-spelled logo
  console.log('\n--- Updating Bedding Products ---');
  const beddingTerms = ['Duvet', 'Fleece Blanket', 'Plush Fleece'];
  
  for (const term of beddingTerms) {
    const products = await stripe.products.search({
      query: `name~'${term}'`,
      limit: 100,
    });
    
    for (const product of products.data) {
      await stripe.products.update(product.id, {
        metadata: {
          ...product.metadata,
          imageUrl: BEDDING_LOGO_URL,
        },
      });
      console.log(`Updated: ${product.name}`);
      updated++;
    }
  }

  console.log(`\nComplete! Updated: ${updated} products`);
  process.exit(0);
}

updateProducts().catch((error) => {
  console.error('Error updating products:', error);
  process.exit(1);
});
