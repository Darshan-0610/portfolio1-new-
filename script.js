// Contact Manager Logic
let contacts = [];
let editingIndex = -1;

// DOM Elements
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const submitBtn = document.getElementById('submitBtn');
const contactList = document.getElementById('contactList');
const contactCount = document.getElementById('contactCount');
const searchBox = document.getElementById('searchBox');

// Error message elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');

// Load contacts from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    displayContacts();
});

// Form submit handler
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        const contact = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        if (editingIndex === -1) {
            // Add new contact
            contacts.push(contact);
        } else {
            // Update existing contact
            contacts[editingIndex] = contact;
            editingIndex = -1;
            submitBtn.textContent = 'Add My Contact';
        }

        saveContacts();
        displayContacts();
        clearForm();
    }
});

// Search functionality
searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm) || 
        contact.email.toLowerCase().includes(searchTerm)
    );
    displayContacts(filteredContacts);
});

// Validate form inputs
function validateForm() {
    let isValid = true;

    // Reset error messages
    nameError.style.display = 'none';
    emailError.style.display = 'none';
    phoneError.style.display = 'none';

    // Validate name
    if (nameInput.value.trim() === '') {
        nameError.style.display = 'block';
        nameInput.style.borderColor = '#ff6b6b';
        isValid = false;
    } else {
        nameInput.style.borderColor = 'rgba(99, 102, 241, 0.3)';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '' || !emailRegex.test(emailInput.value)) {
        emailError.style.display = 'block';
        emailInput.style.borderColor = '#ff6b6b';
        isValid = false;
    } else {
        emailInput.style.borderColor = 'rgba(99, 102, 241, 0.3)';
    }

    // Validate phone
    if (phoneInput.value.trim() === '') {
        phoneError.style.display = 'block';
        phoneInput.style.borderColor = '#ff6b6b';
        isValid = false;
    } else {
        phoneInput.style.borderColor = 'rgba(99, 102, 241, 0.3)';
    }

    return isValid;
}

// Display contacts in the list
function displayContacts(contactsToDisplay = contacts) {
    contactList.innerHTML = '';

    if (contactsToDisplay.length === 0) {
        contactList.innerHTML = `
            <div class="empty-state">
                <p>No contacts yet. Be the first to add your contact!</p>
            </div>
        `;
    } else {
        contactsToDisplay.forEach((contact, index) => {
            const actualIndex = contacts.indexOf(contact);
            const li = document.createElement('li');
            li.className = 'contact-item';
            li.innerHTML = `
                <div class="contact-info">
                    <p><strong>Name:</strong> ${contact.name}</p>
                    <p><strong>Email:</strong> ${contact.email}</p>
                    <p><strong>Phone:</strong> ${contact.phone}</p>
                </div>
                <div class="contact-actions">
                    <button class="btn-edit" onclick="editContact(${actualIndex})">Edit</button>
                    <button class="btn-delete" onclick="deleteContact(${actualIndex})">Delete</button>
                </div>
            `;
            contactList.appendChild(li);
        });
    }

    updateContactCount();
}

// Edit contact
function editContact(index) {
    const contact = contacts[index];
    nameInput.value = contact.name;
    emailInput.value = contact.email;
    phoneInput.value = contact.phone;
    
    editingIndex = index;
    submitBtn.textContent = 'Update Contact';
    
    // Scroll to form
    window.scrollTo({ 
        top: document.getElementById('contact').offsetTop - 100, 
        behavior: 'smooth' 
    });
}

// Delete contact
function deleteContact(index) {
    if (confirm('Are you sure you want to delete this contact?')) {
        contacts.splice(index, 1);
        saveContacts();
        displayContacts();
        
        // Reset edit mode if deleting the contact being edited
        if (editingIndex === index) {
            clearForm();
            editingIndex = -1;
            submitBtn.textContent = 'Add My Contact';
        }
    }
}

// Clear form inputs
function clearForm() {
    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    
    // Reset error states
    nameError.style.display = 'none';
    emailError.style.display = 'none';
    phoneError.style.display = 'none';
    nameInput.style.borderColor = 'rgba(99, 102, 241, 0.3)';
    emailInput.style.borderColor = 'rgba(99, 102, 241, 0.3)';
    phoneInput.style.borderColor = 'rgba(99, 102, 241, 0.3)';
}

// Save contacts to localStorage
function saveContacts() {
    localStorage.setItem('portfolio-contacts', JSON.stringify(contacts));
}

// Load contacts from localStorage
function loadContacts() {
    const storedContacts = localStorage.getItem('portfolio-contacts');
    if (storedContacts) {
        contacts = JSON.parse(storedContacts);
    }
}

// Update contact count
function updateContactCount() {
    contactCount.textContent = contacts.length;
}

// Navigation Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});
