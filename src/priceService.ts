import axios from 'axios';

const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds
let cachedPrice: number | null = null;
let lastFetchTime = 0;

async function fetchEthPrice(): Promise<number> {
  try {
    const response = await axios.get('https://pump.rooni.site/api/price');
    return parseFloat(response.data.price);
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    throw error;
  }
}

export async function getEthPrice(): Promise<number> {
  const now = Date.now();
  if (!cachedPrice || (now - lastFetchTime) > CACHE_DURATION) {
    cachedPrice = await fetchEthPrice();
    lastFetchTime = now;
  }
  return cachedPrice;
}