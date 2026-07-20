// State management: Load from Local Storage or default to an empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Select DOM Elements
const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const filterSelect = document.getElementById('filter-category');
const submitBtn = document.getElementById('submit-btn');

// Initialize Application
function init() {
    renderTransactions(transactions);
    updateSummary();
}

// Generate a random ID for new transactions
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Handle Form Submission (Add or Update)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Grab values from form inputs
    const editId = document.getElementById('edit-id').value;
    const desc = document.getElementById('desc').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    const transaction = {
        id: editId ? parseInt(editId) : generateID(),
        desc, 
        amount, 
        type, 
        category, 
        date
    };

    if (editId) {
        // Update existing transaction
        transactions = transactions.map(t => t.id === transaction.id ? transaction : t);
        document.getElementById('edit-id').value = '';
        submitBtn.innerText = 'Add Transaction';
    } else {
        // Add new transaction
        transactions.push(transaction);
    }

    updateLocalStorage();
    init();
    form.reset(); // Clear the form fields
});

// Render Transactions into the HTML List
function renderTransactions(data) {
    list.innerHTML = ''; // Clear current list
    
    data.forEach(t => {
        const li = document.createElement('li');
        li.classList.add('transaction-item');
        
        // Determine styling based on income/expense
        const sign = t.type === 'income' ? '+' : '-';
        const colorClass = t.type === 'income' ? 'text-green' : 'text-red';
        
        li.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-title">
                    ${t.desc} <span class="${colorClass}">${sign}₹${t.amount.toFixed(2)}</span>
                </div>
                <div class="transaction-meta">${t.date} | ${t.category}</div>
            </div>
            <div class="transaction-actions">
                <button class="btn-edit" onclick="editTransaction(${t.id})">Edit</button>
                <button class="btn-delete" onclick="deleteTransaction(${t.id})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// Update the Top Dashboard Totals
function updateSummary() {
    const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
    
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    // Multiply expense by -1 to display as a positive number in the card
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balanceEl.innerText = `₹${total}`;
    incomeEl.innerText = `₹${income}`;
    expenseEl.innerText = `₹${expense}`;
}

// Delete a Transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

// Edit a Transaction (Populates the form for editing)
function editTransaction(id) {
    const t = transactions.find(t => t.id === id);
    
    // Fill the inputs with the selected transaction's data
    document.getElementById('edit-id').value = t.id;
    document.getElementById('desc').value = t.desc;
    document.getElementById('amount').value = t.amount;
    document.getElementById('type').value = t.type;
    document.getElementById('category').value = t.category;
    document.getElementById('date').value = t.date;
    
    // Change button text to indicate update mode
    submitBtn.innerText = 'Update Transaction';
}

// Filter Transactions by Category
filterSelect.addEventListener('change', (e) => {
    const category = e.target.value;
    if (category === 'All') {
        renderTransactions(transactions);
    } else {
        const filtered = transactions.filter(t => t.category === category);
        renderTransactions(filtered);
    }
});

// Save current transactions array to Local Storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Run the initialization on script load
init();