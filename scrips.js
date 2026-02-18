// Автоматический расчет бюджета при вводе
document.getElementById('income').addEventListener('input', calculateBudget);
document.getElementById('expenses').addEventListener('input', calculateBudget);

// 1. Модель бюджета
[cite_start]// Формула: B = D - R [cite: 86]
function calculateBudget() {
    let income = Number(document.getElementById('income').value);
    let expense = Number(document.getElementById('expenses').value);
    
    let balance = income - expense;
    let savingsRate = 0;
    
    if (income > 0) {
        [cite_start]// Формула доли сбережений (S = B/D * 100%) [cite: 88]
        savingsRate = (balance / income) * 100;
    }

    let resultText = `Баланс: ${balance} ₸`;
    if (balance > 0) {
        resultText += `\nВы можете сберегать ${savingsRate.toFixed(1)}% от дохода.`;
    } else {
        resultText += `\nВнимание! Дефицит бюджета.`;
    }
    
    document.getElementById('budgetResult').innerText = resultText;
}

// Переменная для графика, чтобы можно было его обновлять
let depositChartInstance = null;

// 2. Модель накоплений и инфляции
[cite_start]// Формула сложного процента: S = S0 * (1 + p/100)^t [cite: 107]
[cite_start]// Формула реальной стоимости (инфляция): R = S / (1 + i/100)^t [cite: 161]
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
        
        // Номинальная сумма (сколько будет цифр на счету)
        let nominal = S0 * Math.pow((1 + p / 100), i);
        nominalData.push(nominal);

        // Реальная сумма (покупательная способность с учетом инфляции)
        let real = nominal / Math.pow((1 + inf / 100), i);
        realData.push(real);
    }

    // Отрисовка графика (НАСТРОЙКИ ДЛЯ СВЕТЛОЙ ТЕМЫ)
    const ctx = document.getElementById('depositChart').getContext('2d');
    
    if (depositChartInstance) {
        depositChartInstance.destroy();
    }

    depositChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: yearsLabel,
            datasets: [{
                label: 'Номинальная сумма (с %)',
                data: nominalData,
                borderColor: '#28a745', // Темно-зеленый (хорошо видно на белом)
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                fill: true,
                tension: 0.3 // Плавные линии
            }, {
                label: 'Реальная стоимость (с инфляцией)',
                data: realData,
                borderColor: '#dc3545', // Темно-красный
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
                    text: 'Влияние инфляции на накопления',
                    color: '#333333', // ТЕМНЫЙ ЦВЕТ ЗАГОЛОВКА
                    font: { size: 16 }
                },
                legend: {
                    labels: { color: '#333333' } // ТЕМНЫЙ ЦВЕТ ЛЕГЕНДЫ
                }
            },
            scales: {
                y: { 
                    ticks: { color: '#666666' }, // Темно-серые цифры
                    grid: { color: '#e0e0e0' }   // Светло-серая сетка
                },
                x: { 
                    ticks: { color: '#666666' }, // Темно-серые цифры
                    grid: { color: '#e0e0e0' }   // Светло-серая сетка
                }
            }
        }
    });
}

// 3. Модель кредита (Аннуитет)
[cite_start]// Формула: A = (K * r * (1+r)^n) / ((1+r)^n - 1) [cite: 143]
function calculateLoan() {
    let K = Number(document.getElementById('loanAmount').value);
    let r_yearly = Number(document.getElementById('loanRate').value);
    let n_years = Number(document.getElementById('loanTerm').value);

    // Преобразуем ставку в месячную, а срок в месяцы
    let r_monthly = r_yearly / 100 / 12;
    let n_months = n_years * 12;

    // Аннуитетная формула
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