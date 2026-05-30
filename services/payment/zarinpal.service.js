const axios = require('axios');
const AppError = require('./../../utils/appError');

// می‌توانید با یک شرط، آدرس‌های تستی یا واقعی را بر اساس محیط اجرا تعیین کنید
const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'https://sandbox.zarinpal.com' : 'https://api.zarinpal.com';

const ZARINPAL_CONFIG = {
  merchantId: process.env.ZARINPAL_MERCHANT_ID,
  callbackUrl: process.env.ZARINPAL_CALLBACK_URL,
  requestUrl: `${baseUrl}/pg/v4/payment/request.json`,
  verifyUrl: `${baseUrl}/pg/v4/payment/verify.json`,
  paymentUrl: `${baseUrl}/pg/StartPay/`
};

exports.requestZarinpalPayment = async (amount, description, email, mobile) => {
  try {
    const response = await axios.post(ZARINPAL_CONFIG.requestUrl, {
      merchant_id: ZARINPAL_CONFIG.merchantId,
      amount,
      callback_url: ZARINPAL_CONFIG.callbackUrl,
      description,
      metadata: {
        email,
        mobile
      }
    });

    const data = response.data?.data;

    if (!data || data.code !== 100) {
      throw new AppError('Payment gateway error', 400);
    }

    return {
      authority: data.authority,
      url: `${ZARINPAL_CONFIG.paymentUrl}${data.authority}`
    };
  } catch (err) {
    throw new AppError(
      err.response?.data?.errors?.message || 'Could not connect to payment gateway',
      500
    );
  }
};

exports.verifyZarinpalPayment = async (amount, authority) => {
  try {
    const response = await axios.post(ZARINPAL_CONFIG.verifyUrl, {
      merchant_id: ZARINPAL_CONFIG.merchantId,
      amount,
      authority
    });

    const data = response.data?.data;

    if (!data) {
      throw new AppError('Invalid verification response', 400);
    }

 
    if (data.code !== 100 && data.code !== 101) {
      throw new AppError('Payment verification failed', 400);
    }

    return {
      success: true,
      refId: data.ref_id,
      cardPan: data.card_pan,
      fee: data.fee
    };
  } catch (err) {
    throw new AppError(
      err.response?.data?.errors?.message || 'Payment verification failed',
      500
    );
  }
};



















































