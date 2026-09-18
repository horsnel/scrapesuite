import axios from "axios";

const PAYSTACK_BASE_URL = "https://api.paystack.co";
const PAYSTACK_SECRET_KEY =
  process.env.PAYSTACK_SECRET_KEY || "sk_test_default";

const paystackApi = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

const PLAN_CODES = {
  pro: process.env.PAYSTACK_PRO_PLAN_CODE || "PLN_pro",
  business: process.env.PAYSTACK_BUSINESS_PLAN_CODE || "PLN_business",
};

const PLAN_AMOUNTS = {
  pro: 29000, // ₦29,000 in kobo
  business: 79000, // ₦79,000 in kobo
};

interface InitializeTransactionParams {
  email: string;
  amount: number;
  plan: string;
  metadata: Record<string, unknown>;
}

export async function initializeTransaction({
  email,
  amount,
  plan,
  metadata,
}: InitializeTransactionParams) {
  try {
    const response = await paystackApi.post("/transaction/initialize", {
      email,
      amount,
      plan,
      metadata,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing?verified=true`,
    });
    return response.data;
  } catch (error) {
    console.error("Paystack initialize error:", error);
    throw error;
  }
}

export async function verifyTransaction(reference: string) {
  try {
    const response = await paystackApi.get(
      `/transaction/verify/${encodeURIComponent(reference)}`
    );
    return response.data;
  } catch (error) {
    console.error("Paystack verify error:", error);
    throw error;
  }
}

export async function createSubscription(
  email: string,
  planCode: string
) {
  try {
    const response = await paystackApi.post("/subscription", {
      customer: email,
      plan: planCode,
    });
    return response.data;
  } catch (error) {
    console.error("Paystack subscription error:", error);
    throw error;
  }
}

export { PLAN_CODES, PLAN_AMOUNTS };
