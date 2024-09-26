document.addEventListener('DOMContentLoaded', () => {
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeInputs = document.querySelectorAll('input[name="type"]');
    const addBtn = document.getElementById('add-btn');
    const entriesList = document.getElementById('entries-list');
    const filterInputs = document.querySelectorAll('input[name="filter"]');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const netBalanceEl = document.getElementById('net-balance');
    
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    let isEditing = false;
    let currentEditIndex = null;

    const updateTotals = () => {
        const totalIncome = entries.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpenses = entries.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
        const netBalance = totalIncome - totalExpenses;

        totalIncomeEl.textContent = `$${totalIncome}`;
        totalExpensesEl.textContent = `$${totalExpenses}`;
        netBalanceEl.textContent = `$${netBalance}`;
    };

    const displayEntries = (filter = 'all') => {
        entriesList.innerHTML = '';
        const filteredEntries = filter === 'all' ? entries : entries.filter(e => e.type === filter);
        filteredEntries.forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${entry.description} - $${entry.amount} 
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            entriesList.appendChild(li);
        });
    };

    const addEntry = () => {
        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);
        const type = [...typeInputs].find(r => r.checked).value;

        if (!description || !amount || isNaN(amount)) {
            alert('Please fill in all fields');
            return;
        }

        if (isEditing) {
            entries[currentEditIndex] = { description, amount, type };
            isEditing = false;
            addBtn.textContent = 'Add Entry';
        } else {
            entries.push({ description, amount, type });
        }

        localStorage.setItem('entries', JSON.stringify(entries));
        displayEntries();
        updateTotals();

        descriptionInput.value = '';
        amountInput.value = '';
    };

    const deleteEntry = (index) => {
        entries.splice(index, 1);
        localStorage.setItem('entries', JSON.stringify(entries));
        displayEntries();
        updateTotals();
    };

    const editEntry = (index) => {
        const entry = entries[index];
        descriptionInput.value = entry.description;
        amountInput.value = entry.amount;
        document.querySelector(`input[name="type"][value="${entry.type}"]`).checked = true;

        isEditing = true;
        currentEditIndex = index;
        addBtn.textContent = 'Update Entry';
    };

    addBtn.addEventListener('click', addEntry);

    entriesList.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        
        if (e.target.classList.contains('edit-btn')) {
            editEntry(index);
        }

        if (e.target.classList.contains('delete-btn')) {
            deleteEntry(index);
        }
    });

    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            displayEntries(input.value);
        });
    });

    displayEntries();
    updateTotals();
});
