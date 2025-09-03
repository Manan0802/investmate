// import axios from 'axios';
// const getCryptoPrices = async (req, res) => {
//   try {
//     const ids = req.params.ids;
//     const apiKey = process.env.COINGECKO_API_KEY;
//     if (!apiKey) throw new Error('CoinGecko API key not configured.');
//     const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr&x_cg_demo_api_key=${apiKey}`);
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('CoinGecko API error:', error.message);
//     res.status(500).json({ message: 'Failed to fetch crypto prices' });
//   }
// };
// export { getCryptoPrices };
import axios from 'axios';

const getCryptoPrices = async (req, res) => {
  try {
    const id = req.params.ids;

    // --- Step 1: Get the latest USD to INR exchange rate ---
    const exchangeRateApiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!exchangeRateApiKey) {
      throw new Error('Exchange rate API key is not configured.');
    }
    const exchangeRateResponse = await axios.get(`https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/USD`);
    const inrRate = exchangeRateResponse.data.conversion_rates.INR;
    if (!inrRate) {
      throw new Error('Could not fetch INR exchange rate.');
    }

    // --- Step 2: Get the crypto price in USD from CoinCap ---
    const cryptoResponse = await axios.get(`https://api.coincap.io/v2/assets/${id}`);
    if (!cryptoResponse.data || !cryptoResponse.data.data) {
      return res.status(404).json({ message: 'Cryptocurrency not found' });
    }
    const priceUsd = parseFloat(cryptoResponse.data.data.priceUsd);

    // --- Step 3: Convert the price to INR ---
    const priceInr = priceUsd * inrRate;

    // --- Step 4: Send the response in the original format ---
    const formattedResponse = {
      [id]: {
        inr: priceInr 
      }
    };
    res.status(200).json(formattedResponse);

  } catch (error) {
    console.error('API error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to fetch crypto prices' });
  }
};

export { getCryptoPrices };