import { getUncachableStripeClient } from './stripeClient';

const NEW_LOGO_URL = '/assets/kk_apparel_full_name_logo.jpg';

async function updateToteBags() {
  console.log('Updating tote bag product images in Stripe...');
  const stripe = await getUncachableStripeClient();
  
  const products = await stripe.products.search({
    query: `name:'Branded Tote Bag'`,
  });

  let updated = 0;
  for (const product of products.data) {
    await stripe.products.update(product.id, {
      metadata: {
        ...product.metadata,
        imageUrl: NEW_LOGO_URL,
      },
    });
    console.log(`Updated: ${product.name} (${product.id})`);
    updated++;
  }

  console.log(`\nComplete! Updated: ${updated} products`);
  process.exit(0);
}

updateToteBags().catch((error) => {
  console.error('Error updating tote bags:', error);
  process.exit(1);
});
