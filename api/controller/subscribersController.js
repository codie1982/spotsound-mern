const Subscribe = require('../models/subscribeModel'); // Subscribe modelini import ediyoruz
const asyncHandler = require('express-async-handler');
const ApiResponse = require('../helpers/response'); // ApiResponse'yi doğru yoldan import ediyoruz

// Tüm abonelikleri getirme işlemi
const getSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscribe.find().populate('userid').populate('packageid');

  res.status(200).json(ApiResponse.success(subscriptions, 200, "Subscriptions retrieved successfully"));
});

// Tek bir abonelik getirme işlemi
const getSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscribe.findById(req.params.id).populate('userid').populate('packageid');

  if (!subscription) {
    return res.status(404).json(ApiResponse.error(404, "Subscription not found"));
  }

  res.status(200).json(ApiResponse.success(subscription, 200, "Subscription retrieved successfully"));
});

// Yeni abonelik oluşturma işlemi
const createSubscription = asyncHandler(async (req, res) => {
  const { userid, packageid, paymentMethod, purchaseToken, receiptData, subscriptionStatus, subscriptionType, price, startDate, endDate, autoRenew, transactionId } = req.body;

  const subscription = await Subscribe.create({
    userid,
    packageid,
    paymentMethod,
    purchaseToken,
    receiptData,
    subscriptionStatus,
    subscriptionType,
    price,
    startDate,
    endDate,
    autoRenew,
    transactionId
  });

  res.status(201).json(ApiResponse.success(subscription, 201, "Subscription created successfully"));
});

// Abonelik güncelleme işlemi
const updateSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscribe.findById(req.params.id);

  if (!subscription) {
    return res.status(404).json(ApiResponse.error(404, "Subscription not found"));
  }

  const updatedSubscription = await Subscribe.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedSubscription, 200, "Subscription updated successfully"));
});

// Abonelik silme işlemi
const deleteSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscribe.findById(req.params.id);

  if (!subscription) {
    return res.status(404).json(ApiResponse.error(404, "Subscription not found"));
  }

  await subscription.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Subscription deleted successfully"));
});

module.exports = {
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};
