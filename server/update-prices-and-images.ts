import { getUncachableStripeClient } from './stripeClient';

async function updatePricesAndImages() {
  console.log('Updating product prices and images in Stripe...');
  const stripe = await getUncachableStripeClient();

  const updates = [
    { 
      name: 'Short Sleeve T-Shirt', 
      newPrice: 3000, // $30.00
      imageUrl: '/assets/generated_images/t-shirt_khomplete_khemistri_text.png'
    },
    { 
      name: 'Long Sleeve T-Shirt', 
      newPrice: 3500, // $35.00
      imageUrl: '/assets/generated_images/long_sleeve_khomplete_khemistri.png'
    },
    { 
      name: 'Pullover Hoodie', 
      newPrice: 4000, // $40.00
      imageUrl: '/assets/generated_images/hoodie_khomplete_khemistri_text.png'
    },
    { 
      name: 'Full-Zip Hoodie', 
      newPrice: 5000, // $50.00 (treating as jacket)
      imageUrl: '/assets/generated_images/full-zip_hoodie_branded.png'
    },
    { 
      name: 'Jacket/Coat', 
      newPrice: 6000, // $60.00
      imageUrl: '/assets/generated_images/jacket_khomplete_khemistri_back.png'
    },
  ];

  for (const update of updates) {
    // Find the product
    const products = await stripe.products.search({
      query: `name:'${update.name}'`,
    });

    if (products.data.length > 0) {
      const product = products.data[0];
      
      // Update image URL in metadata
      await stripe.products.update(product.id, {
        metadata: {
          ...product.metadata,
          imageUrl: update.imageUrl,
        },
      });
      
      // Archive old prices and create new one
      const prices = await stripe.prices.list({ product: product.id, active: true });
      
      for (const oldPrice of prices.data) {
        await stripe.prices.update(oldPrice.id, { active: false });
      }
      
      // Create new price
      const newPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: update.newPrice,
        currency: 'usd',
      });
      
      console.log(`Updated: ${update.name} - New price: $${update.newPrice / 100} (${newPrice.id})`);
    } else {
      console.log(`Product not found: ${update.name}`);
    }
  }

  console.log('All products updated!');
  process.exit(0);
}

updatePricesAndImages().catch((error) => {
  console.error('Error updating products:', error);
  process.exit(1);
});
