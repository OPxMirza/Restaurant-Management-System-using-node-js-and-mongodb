// //////////////////////////
document.addEventListener('DOMContentLoaded', function () {

    // reservationForm validation
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function (event) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value.trim();

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phonePattern = /^\+?\d{10,15}$/;

            if (!name) {
                alert('Full Name is required');
                event.preventDefault();
                return;
            }

            if (!email || !emailPattern.test(email)) {
                alert('Valid Email is required');
                event.preventDefault();
                return;
            }

            if (!phone || !phonePattern.test(phone)) {
                alert('Valid Phone Number is required');
                event.preventDefault();
                return;
            }

            if (!date) {
                alert('Date is required');
                event.preventDefault();
                return;
            }

            if (!time) {
                alert('Time is required');
                event.preventDefault();
                return;
            }

            if (!guests || isNaN(guests) || guests <= 0) {
                alert('Number of Guests must be a positive number');
                event.preventDefault();
                return;
            }
        });
    }

    // feedbackForm validation
    const feedbackForm = document.querySelector('form[action="/submit-feedback"]');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (event) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const feedback = document.getElementById('feedback').value.trim();
            const date = document.getElementById('date').value;

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name) {
                alert('Name is required');
                event.preventDefault();
                return;
            }

            if (!email || !emailPattern.test(email)) {
                alert('Valid Email is required');
                event.preventDefault();
                return;
            }

            if (!feedback) {
                alert('Feedback is required');
                event.preventDefault();
                return;
            }

            if (date && new Date(date) > new Date()) {
                alert('Date cannot be in the future');
                event.preventDefault();
                return;
            }
        });
    }

    // /////////////////////////////////////
    // editReservationForm validation
    const editReservationForm = document.getElementById('editReservationForm');
    if (editReservationForm) {
        editReservationForm.addEventListener('submit', function (event) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value.trim();

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phonePattern = /^\+?\d{10,15}$/;

            if (!name) {
                alert('Full Name is required');
                event.preventDefault();
                return;
            }

            if (!email || !emailPattern.test(email)) {
                alert('Valid Email is required');
                event.preventDefault();
                return;
            }

            if (!phone || !phonePattern.test(phone)) {
                alert('Valid Phone Number is required');
                event.preventDefault();
                return;
            }

            if (!date) {
                alert('Date is required');
                event.preventDefault();
                return;
            }

            if (!time) {
                alert('Time is required');
                event.preventDefault();
                return;
            }

            if (!guests || isNaN(guests) || guests <= 0) {
                alert('Number of Guests must be a positive number');
                event.preventDefault();
                return;
            }
        });
    }
});

// STAFF
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addStaffBtn').addEventListener('click', function () {
        document.getElementById('dropdownForm').style.display = 'block';
    });
});

// //////////////////////////////////////////
// Sidebar toggler
document.getElementById('sidebarToggle').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('active');
});

// /////////////////////////////////////////
