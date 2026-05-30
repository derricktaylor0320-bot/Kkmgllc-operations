import { getUncachableStripeClient } from './stripeClient';

async function seedProducts() {
  console.log('Creating products in Stripe...');
  const stripe = await getUncachableStripeClient();

  // Apparel products
  const apparelProducts = [
    {
      name: 'Short Sleeve T-Shirt',
      description: 'Standard weight cotton/blend tee. All garments feature the Left Chest Logo and the large Khomplete Khemistri Back Logo.',
      price: 3000, // $30.00
      category: 'T-Shirts',
      productType: 'apparel',
      imageUrl: '/assets/generated_images/black_t-shirt_design.png',
    },
    {
      name: 'Long Sleeve T-Shirt',
      description: 'Standard weight cotton/blend tee. All garments feature the Left Chest Logo and the large Khomplete Khemistri Back Logo.',
      price: 3800, // $38.00
      category: 'T-Shirts',
      productType: 'apparel',
      imageUrl: '/assets/generated_images/black_t-shirt_design.png',
    },
    {
      name: 'Pullover Hoodie',
      description: 'Mid to Heavyweight cotton/fleece hooded sweatshirt. All garments feature the Left Chest Logo and the large Khomplete Khemistri Back Logo.',
      price: 5500, // $55.00
      category: 'Hoodies',
      productType: 'apparel',
      imageUrl: '/assets/generated_images/white_hoodie_design.png',
    },
    {
      name: 'Full-Zip Hoodie',
      description: 'Mid to Heavyweight cotton/fleece full-zip hooded sweatshirt. All garments feature the Left Chest Logo and the large Khomplete Khemistri Back Logo.',
      price: 6500, // $65.00
      category: 'Hoodies',
      productType: 'apparel',
      imageUrl: '/assets/generated_images/white_hoodie_design.png',
    },
    {
      name: 'Jacket/Coat',
      description: 'Lightweight jacket (e.g., Windbreaker, Coach Jacket) or Fleece Jacket. All garments feature the Left Chest Logo and the large Khomplete Khemistri Back Logo.',
      price: 8500, // $85.00
      category: 'Outerwear',
      productType: 'apparel',
      imageUrl: '/assets/generated_images/white_hoodie_design.png',
    },
  ];

  // Accessory products
  const accessoryProducts = [
    {
      name: 'Royal Purple Tumbler',
      description: 'Insulated tumbler with Khomplete Khemistri branding',
      price: 1000, // $10.00
      category: 'Drinkware',
      productType: 'accessory',
      imageUrl: '/assets/20251126_232618_1764218150041.jpg',
    },
    {
      name: 'Classic White Tumbler',
      description: 'Insulated tumbler with Khomplete Khemistri branding',
      price: 1000, // $10.00
      category: 'Drinkware',
      productType: 'accessory',
      imageUrl: '/assets/20251126_232642_1764218160091.jpg',
    },
    {
      name: 'Strike Orange Tumbler',
      description: 'Insulated tumbler with Khomplete Khemistri branding',
      price: 1000, // $10.00
      category: 'Drinkware',
      productType: 'accessory',
      imageUrl: '/assets/20251126_232603_1764218167991.jpg',
    },
    {
      name: 'Matte Black Mug',
      description: 'Premium ceramic mug with Khomplete Khemistri logo',
      price: 2500, // $25.00
      category: 'Drinkware',
      productType: 'accessory',
      imageUrl: '/assets/generated_images/black_branded_mug.png',
    },
    {
      name: 'Chemistry Socks',
      description: 'Comfortable branded socks',
      price: 1800, // $18.00
      category: 'Socks',
      productType: 'accessory',
      imageUrl: '/assets/generated_images/patterned_socks.png',
    },
    {
      name: 'Executive Umbrella',
      description: 'Luxury branded umbrella',
      price: 4500, // $45.00
      category: 'Lifestyle',
      productType: 'accessory',
      imageUrl: '/assets/stock_images/black_luxury_umbrell_be8b2074.jpg',
    },
    {
      name: 'Signature Scent Candle',
      description: 'Premium scented candle',
      price: 3500, // $35.00
      category: 'Home',
      productType: 'accessory',
      imageUrl: '/assets/stock_images/luxury_scented_candl_c8705703.jpg',
    },
  ];

  const allProducts = [...apparelProducts, ...accessoryProducts];

  for (const productData of allProducts) {
    // Check if product already exists
    const existing = await stripe.products.search({
      query: `name:'${productData.name}'`,
    });

    if (existing.data.length > 0) {
      console.log(`Product already exists: ${productData.name}`);
      continue;
    }

    // Create product with metadata
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      metadata: {
        category: productData.category,
        productType: productData.productType,
        imageUrl: productData.imageUrl,
      },
    });

    // Create price for the product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productData.price,
      currency: 'usd',
    });

    console.log(`Created: ${product.name} (${price.id})`);
  }

  console.log('All products created successfully!');
  process.exit(0);
}

seedProducts().catch((error) => {
  console.error('Error seeding products:', error);
  process.exit(1);
});
