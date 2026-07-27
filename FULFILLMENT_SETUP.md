# Printful and Amazon MCF fulfillment

Paid Square orders are routed after payment verification:

- Tee/T-shirt products → Printful
- Polo products → Amazon Multi-Channel Fulfillment (MCF)

Only these garment categories are submitted. Other products keep the existing
manual fulfillment flow. Provider failures never change a paid order into a
failed checkout; each attempt is persisted and can be retried safely.

## Printful

Required Railway variable:

```text
PRINTFUL_API_TOKEN=...
```

For an account-level token, also add:

```text
PRINTFUL_STORE_ID=...
```

The integration first looks for a Printful store product whose external ID is
this site's catalog price ID, then falls back to an exact product-name match. It
submits automatically only when the selected size/color identifies exactly one
Printful sync variant.

If names do not match or a variant is ambiguous, add a JSON mapping:

```text
PRINTFUL_VARIANT_MAP={
  "price_kkfteenavy": {
    "size=S": 123456789,
    "size=M": 123456790
  }
}
```

Numeric values are Printful `sync_variant_id` values. String values are
Printful `external_variant_id` values. Product names can be used instead of
price IDs. More specific selectors are supported:

```text
logo=Three Crest|color=Black|size=M
color=Black|size=M
size=M
default
```

Printful orders are created with a deterministic external ID and `confirm=1`,
which submits the order and charges the Printful billing method.

## Amazon MCF

This integration uses Amazon's Selling Partner API Fulfillment Outbound
operation. An Amazon Seller Central private application needs the **Amazon
Fulfillment** role and self-authorization.

Required Railway variables:

```text
AMAZON_LWA_CLIENT_ID=...
AMAZON_LWA_CLIENT_SECRET=...
AMAZON_LWA_REFRESH_TOKEN=...
AMAZON_SELLER_SKU_MAP={
  "price_kkpolotrident": {
    "logo=Three Crest|color=Black|size=M": "POLO-3-BLK-M"
  }
}
```

Optional variables:

```text
AMAZON_MARKETPLACE_ID=ATVPDKIKX0DER
AMAZON_SP_API_ENDPOINT=https://sellingpartnerapi-na.amazon.com
AMAZON_MCF_SHIPPING_SPEED=Standard
```

Every mapped seller SKU must already exist as Amazon FBA inventory. The
integration does not purchase a retail Amazon listing; MCF ships inventory
owned by the seller.

## Status and retries

Owner-only endpoints:

- `GET /api/admin/fulfillment/config` — safe configuration booleans; no secrets
- `GET /api/orders/:id/provider-fulfillments` — provider attempts for an order
- `POST /api/orders/:id/fulfill` — retry a blocked or failed paid order

Jobs stay `blocked` when credentials, SKU/variant mappings, or a complete
shipping address are missing. A retry re-evaluates current Railway variables.
Submitted jobs are not sent again.
