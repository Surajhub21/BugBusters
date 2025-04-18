// Initialize Stripe
const stripe = Stripe('YOUR_PUBLISHABLE_KEY'); // Replace with your actual Stripe key

document.addEventListener('DOMContentLoaded', function() {
    // Initialize QR Code
    const qrCodeContainer = document.createElement('div');
    qrCodeContainer.id = 'qr-code-container';
    document.querySelector('main').prepend(qrCodeContainer);

    // Generate QR Code
    function generateQRCode() {
        const bookingUrl = window.location.href;
        const qr = qrcode(0, 'M');
        qr.addData(bookingUrl);
        qr.make();
        const qrImage = qr.createImgTag(4);
        qrCodeContainer.innerHTML = qrImage;
    }

    // Handle form submission
    const bookingForm = document.getElementById('service-booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());
            
            try {
                // Create payment intent
                const response = await fetch('/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const { clientSecret } = await response.json();

                // Confirm payment
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement('card'),
                        billing_details: {
                            name: data.name,
                            email: data.email,
                        },
                    },
                });

                if (result.error) {
                    // Show error to customer
                    console.error(result.error.message);
                } else {
                    // Payment successful
                    console.log('Payment successful:', result.paymentIntent);
                    updateServiceStatus('confirmed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Handle service card clicks
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            document.getElementById('service-type').value = serviceType;
            updateDynamicPricing(serviceType);
        });
    });

    // Update service status
    function updateServiceStatus(status) {
        const statusItems = document.querySelectorAll('.status-item');
        statusItems.forEach(item => {
            const icon = item.querySelector('i');
            const text = item.querySelector('span');
            
            switch(status) {
                case 'confirmed':
                    icon.className = 'fa-solid fa-check-circle';
                    text.textContent = 'Booking confirmed';
                    break;
                case 'assigned':
                    icon.className = 'fa-solid fa-user';
                    text.textContent = 'Technician assigned';
                    break;
                case 'scheduled':
                    icon.className = 'fa-solid fa-calendar';
                    text.textContent = 'Visit scheduled';
                    break;
            }
        });
    }

    // Update dynamic pricing
    function updateDynamicPricing(serviceType) {
        const prices = {
            'one-time': {
                base: 99,
                seasonal: 119,
                discount: 89
            },
            'monthly': {
                base: 79,
                seasonal: 99,
                discount: 69
            },
            'quarterly': {
                base: 199,
                seasonal: 249,
                discount: 179
            }
        };

        const priceElement = document.querySelector(`[data-service="${serviceType}"] .price`);
        if (priceElement) {
            const currentPrice = prices[serviceType].base;
            priceElement.textContent = `From £${currentPrice}`;
        }
    }

    // Generate service history QR code
    function generateServiceHistoryQR() {
        const serviceHistoryUrl = `${window.location.origin}/service-history`;
        const qr = qrcode(0, 'M');
        qr.addData(serviceHistoryUrl);
        qr.make();
        const qrImage = qr.createImgTag(4);
        document.getElementById('service-history-qr').innerHTML = qrImage;
    }

    // Initialize features
    generateQRCode();
    generateServiceHistoryQR();

    // Handle payment option clicks
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const paymentMethod = this.querySelector('p').textContent;
            console.log('Selected payment method:', paymentMethod);
            // Here you would typically handle the payment method selection
        });
    });

    // Handle plan selection
    const planButtons = document.querySelectorAll('.plan-card .btn');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.closest('.plan-card').querySelector('h3').textContent;
            console.log('Selected plan:', plan);
            // Here you would typically handle the plan selection
        });
    });
}); 