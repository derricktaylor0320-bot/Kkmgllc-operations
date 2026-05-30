import { getUncachableStripeClient } from './stripeClient';

async function updateProductImages() {
  console.log('Updating product images in Stripe...');
  const stripe = await getUncachableStripeClient();

  const imageUpdates = [
    { name: 'Short Sleeve T-Shirt', imageUrl: '/assets/generated_images/black_t-shirt_with_eagle_logo.png' },
    { name: 'Long Sleeve T-Shirt', imageUrl: '/assets/generated_images/long_sleeve_shirt_eagle_logo.png' },
    { name: 'Pullover Hoodie', imageUrl: '/assets/generated_images/black_hoodie_with_eagle_logo.png' },
    { name: 'Full-Zip Hoodie', imageUrl: '/assets/generated_images/full-zip_hoodie_eagle_logo.png' },
    { name: 'Jacket/Coat', imageUrl: '/assets/generated_images/black_jacket_with_eagle_logo.png' },
  ];

  for (const update of imageUpdates) {
    const products = await stripe.products.search({
      query: `name:'${update.name}'`,
    });

    if (products.data.length > 0) {
      const product = products.data[0];
      await stripe.products.update(product.id, {
        metadata: {
          ...product.metadata,
          imageUrl: update.imageUrl,
        },
      });
      console.log(`Updated: ${update.name}`);
    } else {
      console.log(`Product not found: ${update.name}`);
    }
  }

  console.log('All product images updated!');
  process.exit(0);
}

updateProductImages().catch((error) => {
  console.error('Error updating products:', error);
  process.exit(1);
});
