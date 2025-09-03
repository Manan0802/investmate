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

    // Fetch asset details from CoinCap API
    const response = await axios.get(`https://api.coincap.io/v2/assets/${id}`);

    if (!response.data || !response.data.data) {
      return res.status(404).json({ message: 'Cryptocurrency not found' });
    }

    const price = parseFloat(response.data.data.priceUsd);
    
    // Format the response to be compatible with your frontend
    const formattedResponse = {
      [id]: {
        usd: price 
      }
    };

    res.status(200).json(formattedResponse);

  } catch (error) {
    console.error('CoinCap API error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to fetch crypto prices' });
  }
};

export { getCryptoPrices };