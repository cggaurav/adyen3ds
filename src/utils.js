// Hint: You should be able to see alternative payment methods if you use the following combination of currency and country code in the paymentMethods request:
// { "countryCode":"DE", "amount":{ "currency":"EUR", "value":1000 } }

const paymentsDefaultConfig = {
    shopperReference: 'Checkout Components sample code test',
    reference: 'Checkout Components sample code test',
    countryCode: 'DE',
    channel: 'Web',
    threeDSAuthenticationOnly: true,
    merchantAccount: 'SupportRecruitementCOM',
    amount: {
        value: 1000,
        currency: 'EUR'
    }
};

// Generic POST Helper
const httpPost = (endpoint, data) =>
    fetch(`/${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());

// Get all available payment methods from the local server
const getPaymentMethods = () =>
    httpPost('paymentMethods', paymentsDefaultConfig)
        .then(response => {
            if (response.error) throw 'No paymentMethods available';

            return response;
        })
        .catch(console.error);


// Posts a new payment into the local server
const makePayment = (paymentMethod, config = {}) => {
    const paymentsConfig = { ...paymentsDefaultConfig, ...config };
    const paymentRequest = { ...paymentsConfig, ...paymentMethod };

    updateRequestContainer(paymentRequest);

    return httpPost('payments', paymentRequest)
        .then(response => {
            if (response.error) throw 'Payment initiation failed';

            updateResponseContainer(response);

            return response;
        })
        .catch(console.error);
};

const makePaymentDetails = (paymentAction, config = {}) => {

    return httpPost('payments/details', paymentAction)
        .then(response => {
            if (response.error) throw 'Payment details failed';

            updateResponseContainer(response);

            return response;
        })
        .catch(console.error);
};

// Fetches an originKey from the local server
const getOriginKey = () =>
    httpPost('originKeys')
        .then(response => {
            if (response.error || !response.originKeys) throw 'No originKey available';

            console.log('originKeys', response.originKeys)
            return response.originKeys[Object.keys(response.originKeys)[0]];

        })
        .catch(console.error);
