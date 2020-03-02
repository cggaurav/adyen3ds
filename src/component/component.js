// Compontents: https://docs.adyen.com/checkout/components-web
let checkout;
let card;
let sepa;

function handleOnChange(state, component) {
   // state.isValid // True or false. Specifies if all the information that the shopper provided is valid.
   // state.data // Provides the data that you need to pass in the `/payments` call.
   // component // Provides the active component instance that called this event.

   if (state.isValid) {
    // Lets focus on the 3DS2 flow
    state.data.additionalData = state.data.additionalData || {}
    state.data.additionalData.allow3DS2 = true
    state.data.channel = 'Web'
    state.data.origin = window.location.origin
    state.data.returnUrl = state.data.returnUrl = 'https://adyen101.herokuapp.com/component/'
    // state.data.threeDSAuthenticationOnly = true

    // console.log('makePayment', state.data)

    makePayment(state.data)
        .then(response => {
            if (response.action && (response.action.type === 'threeDS2Fingerprint' || response.action.type === 'threeDS2Challenge')) {
                // console.log("We have an action object from makePayment", response)
                // https://docs.adyen.com/checkout/3d-secure/native-3ds2/web-component
                checkout.createFromAction(response.action).mount('#card-component-container');
            } else {
                // console.log("We DON'T have an action object from makePayment", response)
                updatePaymentStatusContainer([response.resultCode, response.pspReference].join(' '))
                updateStateContainer(response)
            }
        })
        .catch((console.error))
   }
}

function handleOnAdditionalDetails(state, component) {
   // state.data // Provides the data that you need to pass in the `/payments/details` call.
   // component // Provides the active component instance that called this event.
   // console.log('makePaymentDetails', state.data)

   makePaymentDetails(state.data)
       .then(response => {
           if (response.action) {
              // console.log("We have an action object from makePaymentDetails", response)
              checkout.createFromAction(response.action).mount('#card-component-container');
           } else {

              if (response.resultCode === 'AuthenticationFinished') {
                  console.log('AuthenticationFinished', state.data)
                  makePaymentDetails({
                      ...state.data,
                      ...{threeDSAuthenticationOnly: false}
                  })
                  .then((newResponse) => {
                      updatePaymentStatusContainer([newResponse.resultCode, newResponse.pspReference].join(' '))
                      updateStateContainer(newResponse)
                  })
              } else {
                  updatePaymentStatusContainer([response.resultCode, response.pspReference].join(' '))
                  updateStateContainer(response)
              }
              
           }
       })
       .catch((console.error))
}

const configuration = {
   locale: "en_US", // The shopper's locale. For a list of supported locales, see https://docs.adyen.com/checkout/components-web/localization-components.
   environment: "test", // When you're ready to accept live payments, change the value to one of our live environments https://docs.adyen.com/checkout/components-web#testing-your-integration.  
   onChange: handleOnChange, // Your function for handling onChange event
   onAdditionalDetails: handleOnAdditionalDetails // Your function for handling onAdditionalDetails event
};


getOriginKey().then(originKey => {
    
    // Your website's Origin Key. To find out how to generate one, see https://docs.adyen.com/user-management/how-to-get-an-origin-key.
    configuration.originKey = originKey

    getPaymentMethods().then(paymentMethodsResponse => {

        // The payment methods response returned in step 1.
        configuration.paymentMethodsResponse - paymentMethodsResponse

        // 1. Create an instance of AdyenCheckout    
        checkout = new AdyenCheckout(configuration);

        // https://docs.adyen.com/payment-methods/cards/web-component
        card = checkout.create("card", {
          // hasHolderName: true,
          // holderNameRequired: true,
          // billingAddressRequired: true
        }).mount("#card-component-container");

        // https://docs.adyen.com/payment-methods/sepa-direct-debit/web-component
        sepa = checkout.create("sepadirectdebit").mount("#sepa-component-container");

    })

});
