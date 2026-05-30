import { getUncachableStripeClient } from './stripeClient';

const BEDDING_LOGO_URL = '/assets/kk_accessories_bedding_logo.jpg';

const sizeUpdates: Record<string, { prefix: string; pillows: string }> = {
  'Twin': { prefix: 'TW', pillows: '1 pillowsham' },
  'Full': { prefix: 'Ful', pillows: '2 pillowshams' },
  'Queen': { prefix: 'Qn', pillows: '2 pillowshams' },
  'King': { prefix: 'Kg', pillows: '2 pillowshams' },
  'California King': { prefix: 'Cali. Kg', pillows: '2 pillowshams' },
  'Full/Queen': { prefix: 'Ful/Qn', pillows: '' },
};

async function updateBeddingProducts() {
  console.log('Updating all bedding product descriptions with size initials...');
  const stripe = await getUncachableStripeClient();
  
  let updated = 0;
  
  // Get all products with bedding-related names
  const allProducts = await stripe.products.list({ limit: 100, active: true });
  const allProducts2 = await stripe.products.list({ limit: 100, active: true, starting_after: allProducts.data[allProducts.data.length - 1].id });
  
  const products = [...allProducts.data, ...allProducts2.data];
  
  for (const product of products) {
    const name = product.name.toLowerCase();
    
    // Check if this is a bedding product
    if (name.includes('duvet') || name.includes('fleece') || name.includes('blanket')) {
      // Find which size this is
      let sizeInfo = null;
      let sizeKey = '';
      
      for (const [size, info] of Object.entries(sizeUpdates)) {
        if (product.name.includes(size)) {
          sizeInfo = info;
          sizeKey = size;
          break;
        }
      }
      
      if (!sizeInfo) continue;
      
      let newDescription = '';
      
      if (name.includes('duvet')) {
        if (name.includes('khomplete khemistri accessories')) {
          newDescription = `${sizeInfo.prefix} - Elegant duvet comforter set featuring the Khomplete Khemistri Accessories eagle badge. "Sleep and Dream in Luxury" - Rich burgundy brown. Includes duvet cover and ${sizeInfo.pillows}. Insert not included.`;
        } else if (name.includes('khemistri') || name.includes('logo')) {
          newDescription = `${sizeInfo.prefix} - Elegant duvet comforter set with Khomplete Khemistri Accessories logo embroidered at foot. "Sleep and Dream in Luxury" - Rich burgundy brown with gold crest. Includes duvet cover and ${sizeInfo.pillows}. Insert not included.`;
        } else {
          newDescription = `${sizeInfo.prefix} - Elegant duvet comforter set in rich burgundy brown. Premium microfiber fabric with button closure. Includes duvet cover and ${sizeInfo.pillows}. Insert not included.`;
        }
      } else if (name.includes('fleece') || name.includes('blanket')) {
        const dimensions = sizeKey === 'Twin' ? '60" x 80"' : 
                          sizeKey === 'Full/Queen' ? '80" x 90"' : 
                          sizeKey === 'King' ? '90" x 100"' : '';
        
        if (name.includes('khomplete khemistri accessories')) {
          newDescription = `${sizeInfo.prefix}${dimensions ? ` (${dimensions})` : ''} - Plush fleece throw blanket featuring the Khomplete Khemistri Accessories eagle badge. "Sleep and Dream in Luxury" - Deep burgundy brown. Soft and cozy for bed or couch.`;
        } else if (name.includes('khemistri') || name.includes('logo')) {
          newDescription = `${sizeInfo.prefix}${dimensions ? ` (${dimensions})` : ''} - Plush fleece throw blanket with Khomplete Khemistri Accessories logo in center. "Sleep and Dream in Luxury" - Deep burgundy brown with gold crest. Soft and cozy for bed or couch.`;
        } else {
          newDescription = `${sizeInfo.prefix}${dimensions ? ` (${dimensions})` : ''} - Ultra-soft plush fleece blanket in deep burgundy brown. Cozy and warm for bed or couch. Machine washable.`;
        }
      }
      
      if (newDescription) {
        await stripe.products.update(product.id, {
          description: newDescription,
          metadata: {
            ...product.metadata,
            imageUrl: BEDDING_LOGO_URL,
          },
        });
        console.log(`Updated: ${product.name} -> ${sizeInfo.prefix}`);
        updated++;
      }
    }
  }

  console.log(`\nComplete! Updated: ${updated} products`);
  process.exit(0);
}

updateBeddingProducts().catch((error) => {
  console.error('Error updating bedding products:', error);
  process.exit(1);
});
