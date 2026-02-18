// Слушаем изменение дохода
document.getElementById('income').addEventListener('input', calculateBudget);

// Функция добавления новой строки расхода
function addExpenseRow() {
    const list = document.getElementById('expensesList');
    
    // Создаем новый div
    const div = document.createElement('div');
    div.className = 'expense-row';
    
    // Вставляем внутрь два инпута
    div.innerHTML = `
        <input type="text" placeholder="Название" class="exp-name">
        <input type="number" value="0" class="exp-cost" oninput="calculateBudget()">
    `;
    
    list.appendChild(div); // Добавляем на страницу
}

// 1. БЮДЖЕТ (Обновленная логика)
function calculateBudget() {
    let incomeInput = document.getElementById('income');
    let income = incomeInput.value ? Number(incomeInput.value) : 0;
    
    // Считаем сумму всех расходов
    let totalExpense = 0;
    let expenseInputs = document.querySelectorAll('.exp-cost'); // Берем все поля с ценами
    
    expenseInputs.forEach(function(input) {
        totalExpense += Number(input.value);
    });
    
    let balance = income - totalExpense;
    let savingsRate = 0;
    
    if (income > 0) {
        savingsRate = (balance / income) * 100;
    }

    let resultText = `Всего расходов: ${totalExpense} ₸\nОстаток: ${balance} ₸`;
    let resultBox = document.getElementById('budgetResult');
    
    if (balance > 0) {
        resultText += `\nРекомендуется откладывать 20% от остатка: ${(balance * 0.2).toFixed(0)} ₸`;
        resultBox.style.color = "#2e7d32";
        resultBox.style.backgroundColor = "#e8f5e9";
    } else if (balance < 0) {
        resultText += `\nВнимание! Вы ушли в минус.`;
        resultBox.style.color = "#c62828";
        resultBox.style.backgroundColor = "#ffebee";
    } else {
        resultText += `\nВы тратите всё под ноль.`;
        resultBox.style.color = "#333";
        resultBox.style.backgroundColor = "#f5f5f5";
    }
    
    resultBox.innerText = resultText;
}

// --- 2. НАКОПЛЕНИЯ ---
function calculateDeposit() {
    let S0 = Number(document.getElementById('depositAmount').value);
    let p = Number(document.getElementById('depositRate').value);
    let t = Number(document.getElementById('depositTerm').value);
    let inf = Number(document.getElementById('inflationRate').value);

    let yearsLabel = [];
    let nominalData = [];
    let realData = [];

    for (let i = 0; i <= t; i++) {
        yearsLabel.push(i + " год");
        
        // Формула сложного процента
        let nominal = S0 * Math.pow((1 + p / 100), i);
        nominalData.push(nominal);

        // Формула с учетом инфляции
        let real = nominal / Math.pow((1 + inf / 100), i);
        realData.push(real);
    }

    const ctx = document.getElementById('depositChart').getContext('2d');
    
    if (depositChartInstance) {
        depositChartInstance.destroy();
    }

    depositChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: yearsLabel,
            datasets: [{
                label: 'Номинальная сумма',
                data: nominalData,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                fill: true,
                tension: 0.3
            }, {
                label: 'Реальная стоимость (с инфляцией)',
                data: realData,
                borderColor: '#dc3545',
                borderDash: [5, 5], 
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Рост накоплений vs Инфляция',
                    color: '#333',
                    font: { size: 16 }
                },
                legend: {
                    labels: { color: '#333' }
                }
            },
            scales: {
                y: { ticks: { color: '#666' }, grid: { color: '#e0e0e0' } },
                x: { ticks: { color: '#666' }, grid: { color: '#e0e0e0' } }
            }
        }
    });
}

// --- 3. КРЕДИТ ---
function calculateLoan() {
    let K = Number(document.getElementById('loanAmount').value);
    let r_yearly = Number(document.getElementById('loanRate').value);
    let n_years = Number(document.getElementById('loanTerm').value);

    let r_monthly = r_yearly / 100 / 12;
    let n_months = n_years * 12;

    let monthlyPayment;
    if (r_monthly === 0) {
        monthlyPayment = K / n_months;
    } else {
        monthlyPayment = (K * r_monthly * Math.pow(1 + r_monthly, n_months)) / 
                         (Math.pow(1 + r_monthly, n_months) - 1);
    }

    let totalAmount = monthlyPayment * n_months;
    let overpayment = totalAmount - K;

    document.getElementById('loanResult').innerText = 
        `Ежемесячный платеж: ${Math.round(monthlyPayment)} ₸
        Общая сумма выплат: ${Math.round(totalAmount)} ₸
        Переплата банку: ${Math.round(overpayment)} ₸`;
}

// Запустить расчет бюджета сразу при загрузке страницы
calculateBudget();