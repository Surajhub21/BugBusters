document.addEventListener('DOMContentLoaded', function() {
    // Generate QR codes for each service
    const qrCodes = document.querySelectorAll('.qr-code');
    
    qrCodes.forEach(qrContainer => {
        const service = qrContainer.getAttribute('data-service');
        const bookingUrl = `${window.location.origin}/service-booking.html?service=${service}`;
        
        // Generate QR code
        const qr = qrcode(0, 'M');
        qr.addData(bookingUrl);
        qr.make();
        
        // Create QR code image
        const qrImage = qr.createImgTag(4);
        qrContainer.innerHTML = qrImage;
    });

    // Handle booking button clicks
    const bookButtons = document.querySelectorAll('.book-now-btn');
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const service = this.getAttribute('href').split('=')[1];
            window.location.href = `service-booking.html?service=${service}`;
        });
    });
}); 