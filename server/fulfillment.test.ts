import assert from "node:assert/strict";
import test from "node:test";
import {
  configuredAmazonSku,
  configuredPrintfulVariant,
  fulfillmentProviderFor,
  selectionKeys,
} from "./fulfillmentRouting";
import {
  discoverPrintfulVariant,
  submitPrintfulFulfillment,
} from "./printfulClient";
import { submitAmazonMcfFulfillment } from "./amazonMcfClient";

const address = {
  name: "Pat Customer",
  addressLine1: "123 Main St",
  city: "Baltimore",
  stateCode: "MD",
  postalCode: "21201",
  countryCode: "US",
  email: "pat@example.com",
};

test("routes tees to Printful and polos to Amazon by default", () => {
  assert.equal(
    fulfillmentProviderFor({
      name: "Founders Tee",
      catalogPriceId: "price_tee",
      metadata: { category: "T-Shirts" },
    }),
    "printful",
  );
  assert.equal(
    fulfillmentProviderFor({
      name: "Personalized Polo Shirt",
      catalogPriceId: "price_polo",
      metadata: { category: "Polos" },
    }),
    "amazon",
  );
  assert.equal(
    fulfillmentProviderFor({
      name: "Personalized Polo Shirt",
      metadata: { category: "Polos", fulfillmentProvider: "printful" },
    }),
    "printful",
  );
  assert.equal(
    fulfillmentProviderFor({
      name: "Branded Tumbler",
      metadata: { category: "Drinkware" },
    }),
    null,
  );
});

test("uses the most specific configured size and color mappings", () => {
  const item = {
    name: "Personalized Polo Shirt",
    quantity: 1,
    amountCents: 4500,
    selectedLogo: "Three Crest",
    selectedColor: "Black",
    selectedSize: "M",
  };
  assert.deepEqual(selectionKeys(item).slice(0, 2), [
    "logo=Three Crest|color=Black|size=M",
    "color=Black|size=M",
  ]);

  const product = {
    name: item.name,
    catalogPriceId: "price_polo",
    metadata: {},
  };
  assert.deepEqual(
    configuredPrintfulVariant(
      JSON.stringify({
        price_polo: {
          "color=Black|size=M": { syncVariantId: 456 },
          default: 123,
        },
      }),
      product,
      item,
    ),
    { syncVariantId: 456 },
  );
  assert.equal(
    configuredAmazonSku(
      JSON.stringify({
        "Personalized Polo Shirt": {
          "logo=Three Crest|color=Black|size=M": {
            sellerSku: "POLO-3-BLK-M",
          },
        },
      }),
      product,
      item,
    ),
    "POLO-3-BLK-M",
  );
});

test("discovers one exact Printful store variant", async () => {
  const calls: string[] = [];
  const fetchImpl: typeof fetch = async (input) => {
    const url = String(input);
    calls.push(url);
    if (url.includes("/store/products?")) {
      return new Response(
        JSON.stringify({
          result: [
            {
              id: 77,
              external_id: "price_tee",
              name: "Founders Tee",
            },
          ],
        }),
        { status: 200 },
      );
    }
    return new Response(
      JSON.stringify({
        result: {
          sync_variants: [
            { id: 101, name: "Founders Tee (Black / S)" },
            { id: 102, name: "Founders Tee (Black / M)" },
          ],
        },
      }),
      { status: 200 },
    );
  };

  const result = await discoverPrintfulVariant(
    {
      name: "Founders Tee",
      catalogPriceId: "price_tee",
      selectedColor: "Black",
      selectedSize: "M",
    },
    {
      fetchImpl,
      env: { PRINTFUL_API_TOKEN: "test-token" },
    },
  );
  assert.deepEqual(result, { syncVariantId: 102 });
  assert.equal(calls.length, 2);
});

test("submits and auto-confirms a Printful order with a stable external ID", async () => {
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = String(input);
    requests.push({ url, init });
    if (init?.method === "GET") {
      return new Response(JSON.stringify({ code: 404 }), { status: 404 });
    }
    return new Response(
      JSON.stringify({ result: { id: 9001, status: "pending" } }),
      { status: 200 },
    );
  };

  const result = await submitPrintfulFulfillment(
    {
      externalId: "kk_pf_abc",
      recipient: address,
      items: [
        {
          orderItemIndex: 0,
          name: "Founders Tee",
          quantity: 2,
          amountCents: 3000,
          providerVariantId: 102,
        },
      ],
    },
    {
      fetchImpl,
      env: {
        PRINTFUL_API_TOKEN: "test-token",
        PRINTFUL_STORE_ID: "123",
      },
    },
  );
  assert.deepEqual(result, { providerOrderId: "9001", status: "pending" });
  assert.match(requests[1].url, /\/orders\?confirm=1$/);
  const body = JSON.parse(String(requests[1].init?.body));
  assert.equal(body.external_id, "kk_pf_abc");
  assert.equal(body.items[0].sync_variant_id, 102);
  assert.equal(body.recipient.state_code, "MD");
  assert.equal(
    (requests[1].init?.headers as Record<string, string>)["X-PF-Store-Id"],
    "123",
  );
});

test("exchanges LWA credentials and creates an Amazon MCF order", async () => {
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = String(input);
    requests.push({ url, init });
    if (url.includes("/auth/o2/token")) {
      return new Response(
        JSON.stringify({ access_token: "lwa-access", expires_in: 3600 }),
        { status: 200 },
      );
    }
    if (init?.method === "GET") {
      return new Response(JSON.stringify({ errors: [] }), { status: 404 });
    }
    return new Response(JSON.stringify({}), { status: 200 });
  };

  const result = await submitAmazonMcfFulfillment(
    {
      externalId: "kk-amz-abc",
      recipient: address,
      items: [
        {
          orderItemIndex: 0,
          name: "Personalized Polo Shirt",
          quantity: 1,
          amountCents: 4500,
          sellerSku: "POLO-BLK-M",
        },
      ],
    },
    {
      fetchImpl,
      env: {
        AMAZON_LWA_CLIENT_ID: "test-client-fulfillment",
        AMAZON_LWA_CLIENT_SECRET: "test-secret",
        AMAZON_LWA_REFRESH_TOKEN: "test-refresh",
        AMAZON_MARKETPLACE_ID: "ATVPDKIKX0DER",
      },
    },
  );
  assert.deepEqual(result, {
    providerOrderId: "kk-amz-abc",
    status: "received",
  });
  assert.equal(requests.length, 3);
  const create = requests[2];
  const body = JSON.parse(String(create.init?.body));
  assert.equal(body.sellerFulfillmentOrderId, "kk-amz-abc");
  assert.equal(body.items[0].sellerSku, "POLO-BLK-M");
  assert.equal(
    (create.init?.headers as Record<string, string>)["x-amz-access-token"],
    "lwa-access",
  );
});
