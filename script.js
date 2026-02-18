// Автоматический запуск расчета бюджета при изменении цифр
document.getElementById('income').addEventListener('input', calculateBudget);
document.getElementById('expenses').addEventListener('input', calculateBudget);

// --- 1. БЮДЖЕТ ---
function calculateBudget() {
    let incomeInput = document.getElementById('income');
    let expenseInput = document.getElementById('expenses');

    // Если поля пустые, считаем их равными 0 (защита от ошибок)
    let income = incomeInput.value ? Number(incomeInput.value) : 0;
    let expense = expenseInput.value ? Number(expenseInput.value) : 0;
    
    let balance = income - expense;
    let savingsRate = 0;
    
    if (income > 0) {
        savingsRate = (balance / income) * 100;
    }

    let resultText = `Баланс: ${balance} ₸`;
    
    // Логика цвета и текста
    let resultBox = document.getElementById('budgetResult');
    
    if (balance > 0) {
        resultText += `\nВы можете сберегать ${savingsRate.toFixed(1)}% от дохода.`;
        resultBox.style.color = "#2e7d32"; // Зеленый текст
        resultBox.style.backgroundColor = "#e8f5e9"; // Зеленый фон
    } else if (balance < 0) {
        resultText += `\nВнимание! Дефицит бюджета.`;
        resultBox.style.color = "#c62828"; // Красный текст
        resultBox.style.backgroundColor = "#ffebee"; // Красный фон
    } else {
        resultText += `\nВыходите в ноль.`;
        resultBox.style.color = "#333";
        resultBox.style.backgroundColor = "#f5f5f5";
    }
    
    resultBox.innerText = resultText;
}

// Переменная для графика
let depositChartInstance = null;

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