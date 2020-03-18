// 0. Get originKey
getOriginKey().then(originKey => {
    getPaymentMethods().then(paymentMethodsResponse => {
        // 1. Create an instance of AdyenCheckout
        const checkout = new AdyenCheckout({
            environment: 'test',
            originKey: originKey, // Mandatory. originKey from Costumer Area
            paymentMethodsResponse,
            removePaymentMethods: ['paysafecard', 'c_cash'],
            // paymentMethodsConfiguration: {
            //     hasHolderName: true,
            //     holderNameRequired: true,
            //     billingAddressRequired: true
            // }
        });

        // 2. Create and mount the Component
        const dropin = checkout
            .create('dropin', {
                // Events
                onSelect: activeComponent => {
                    updateStateContainer(activeComponent.data); // Demo purposes only
                },
                onChange: state => {
                    updateStateContainer(state); // Demo purposes only
                },
                onSubmit: (state, component) => {
                    // state.data;
                    // state.isValid;

                    // Lets focus on the 3DS2 flow
                    state.data.additionalData = state.data.additionalData || {}
                    state.data.additionalData.allow3DS2 = true
                    state.data.channel = 'Web'
                    state.data.origin = window.location.origin
                    state.data.returnUrl = 'https://adyen101.herokuapp.com/dropin/'
                    // state.data.threeDSAuthenticationOnly = true

                    console.log('makePayment', state.data)

                    makePayment(state.data)
                        .then(response => {
                            if (response.action) {
                                console.log("We have an action object from makePayment", response)
                                dropin.handleAction(response.action)
                            } else {
                                console.log("We DON'T have an action object from makePayment", response)
                                updatePaymentMethodContainer([response.resultCode, response.pspReference].join(' '))
                                updateStateContainer(response)
                            }
                        })
                        .catch((console.error))
                },
                onAdditionalDetails: (state, component) => {
                    
                    const paymentDetailsPayload = {
                        details: state.data.details,
                        paymentData: state.data.paymentData
                    }

                    console.log('makePaymentDetails', paymentDetailsPayload)

                    makePaymentDetails(paymentDetailsPayload)
                        .then(response => {
                            if (response.action) {
                                console.log("We have an action object from makePaymentDetails", response)
                                dropin.handleAction(response.action)
                            } else {
                                console.log("We DON'T have an action object from makePaymentDetails", response)
                                updatePaymentMethodContainer([response.resultCode, response.pspReference].join(' '))
                                updateStateContainer(response)
                                
                            }
                        })
                        .catch((console.error))
                }
            })
            .mount('#dropin-container');
    });
});