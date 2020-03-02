// 1. Create an instance of AdyenCheckout
const checkout = new AdyenCheckout({});

// 2. Create and mount the Component
const googlepay = checkout
    .create('grabpay_SG', {
        showPayButton: true,
        environment: 'TEST', // GrabPay Pay environment
        configuration: {
            gatewayMerchantId: 'SupportRecruitementCOM', // name of your Adyen Merchant account
            merchantName: 'Adyen Test' // Name to be shown
        },

        // Events
        onSubmit: (state, component) => {
            // Submit Payment
            makePayment(state.data);

            updateStateContainer(state); // Demo purposes only
        },
        onError: error => {
            console.error(error);
        }
    })
    // Normally, you should check if GrabPay Pay is available before mounting it.
    // Here we are mounting it directly for demo purposes.
    // Please refer to the documentation for more information on GrabPay Pay's availability.
    .mount('#grabpay-container');
