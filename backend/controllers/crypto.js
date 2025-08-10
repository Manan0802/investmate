import axios from 'axios';
const getCryptoPrices = async (req, res) => {
  try {
    const ids = req.params.ids;
    const apiKey = process.env.COINGECKO_API_KEY;
    if (!apiKey) throw new Error('CoinGecko API key not configured.');
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr&x_cg_demo_api_key=${apiKey}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('CoinGecko API error:', error.message);
    res.status(500).json({ message: 'Failed to fetch crypto prices' });
  }
};
export { getCryptoPrices };