import Investment from '../models/investment.js';

// Get all investment entries for the logged-in user
const getInvestments = async (req, res) => {
  const investments = await Investment.find({ user: req.user.id }).sort({ date: 'desc' });
  res.status(200).json(investments);
};

// Add a new single investment entry (a 'buy' event)
const addInvestment = async (req, res) => {
  const { assetType, assetName, quantity, buyPrice, date } = req.body;
  if (!assetType || !assetName || !quantity || !buyPrice || !date) {
    res.status(400); throw new Error('Please provide all fields');
  }
  const investment = await Investment.create({
    assetType, assetName, quantity, buyPrice, date, user: req.user.id,
  });
  res.status(201).json(investment);
};

// Update the main details of an investment entry
const updateInvestment = async (req, res) => {
  const investment = await Investment.findById(req.params.id);
  if (!investment) { res.status(404); throw new Error('Investment not found'); }
  if (investment.user.toString() !== req.user.id) { res.status(401); throw new Error('User not authorized'); }
  const updatedInvestment = await Investment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedInvestment);
};

// Delete an entire investment entry
const deleteInvestment = async (req, res) => {
  const investment = await Investment.findById(req.params.id);
  if (!investment) { res.status(404); throw new Error('Investment not found'); }
  if (investment.user.toString() !== req.user.id) { res.status(401); throw new Error('User not authorized'); }
  await investment.deleteOne();
  res.status(200).json({ id: req.params.id });
};

// Add a new sale to an existing investment's sales array
const addSale = async (req, res) => {
  const { unitsSold, sellPrice, date } = req.body;
  const investment = await Investment.findById(req.params.id);
  if (!investment) { res.status(404); throw new Error('Investment not found'); }
  if (investment.user.toString() !== req.user.id) { res.status(401); throw new Error('User not authorized'); }
  investment.sales.push({ unitsSold, sellPrice, date });
  const updatedInvestment = await investment.save();
  res.status(200).json(updatedInvestment);
};

// **NEW FUNCTION** to update a specific sale within an investment
const updateSale = async (req, res) => {
    const { investmentId, saleId } = req.params;
    const { unitsSold, sellPrice, date } = req.body;
    const investment = await Investment.findById(investmentId);
    if (!investment) { res.status(404); throw new Error('Investment not found'); }
    if (investment.user.toString() !== req.user.id) { res.status(401); throw new Error('User not authorized'); }
    
    // Find the specific sale sub-document by its ID
    const sale = investment.sales.id(saleId);
    if (!sale) { res.status(404); throw new Error('Sale not found'); }

    // Update its properties
    sale.unitsSold = unitsSold;
    sale.sellPrice = sellPrice;
    sale.date = date;

    // Save the parent investment document
    await investment.save();
    res.status(200).json(investment);
};


// **NEW FUNCTION** to delete a specific sale from an investment's sales array
const deleteSale = async (req, res) => {
    const { investmentId, saleId } = req.params;
    const investment = await Investment.findById(investmentId);
    if (!investment) { res.status(404); throw new Error('Investment not found'); }
    if (investment.user.toString() !== req.user.id) { res.status(401); throw new Error('User not authorized'); }
    
    // Find and remove the specific sale sub-document
    investment.sales.pull({ _id: saleId });
    await investment.save();
    res.status(200).json(investment);
};

// Export all the necessary functions
export { getInvestments, addInvestment, updateInvestment, deleteInvestment, addSale, updateSale, deleteSale };