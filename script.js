document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.getElementById("transactionForm");
    const transactionList = document.getElementById("transactionList");
    const totalIncomeEl = document.getElementById("totalIncome");
    const totalExpensesEl = document.getElementById("totalExpenses");
    const balanceEl = document.getElementById("balance");
    const highestCategoryEl = document.getElementById("highestCategory");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const filterPeriod = document.getElementById("filterPeriod");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function saveTransactions() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    function updateDashboard() {
        const income = transactions.filter(t => t.category === "Income").reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.category !== "Income").reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;

        totalIncomeEl.textContent = `₹${income}`;
        totalExpensesEl.textContent = `₹${expenses}`;
        balanceEl.textContent = `₹${balance}`;

        const spendingCategories = transactions
            .filter(t => t.category !== "Income")
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        const highestCategory = Object.entries(spendingCategories).sort((a, b) => b[1] - a[1])[0];
        highestCategoryEl.textContent = highestCategory ? `${highestCategory[0]} (₹${highestCategory[1]})` : "N/A";

        updateCharts();
    }

    function renderTransactions() {
        transactionList.innerHTML = "";
        transactions.forEach((transaction, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${transaction.description} - ₹${transaction.amount} (${transaction.category} on ${transaction.date})
                <button onclick="deleteTransaction(${index})">❌</button>
            `;
            transactionList.appendChild(li);
        });
    }

    window.deleteTransaction = (index) => {
        transactions.splice(index, 1);
        saveTransactions();
        renderTransactions();
        updateDashboard();
    };

    transactionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const description = document.getElementById("description").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;

        if (!description || isNaN(amount) || !date) return alert("Please fill out all fields correctly.");

        transactions.push({ description, amount, category, date });
        saveTransactions();
        transactionForm.reset();
        renderTransactions();
        updateDashboard();
    });

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    filterPeriod.addEventListener("change", updateCharts);

    const expenseChartCtx = document.getElementById("expenseChart").getContext("2d");
    const lineChartCtx = document.getElementById("lineChart").getContext("2d");
    const pieChartCtx = document.getElementById("pieChart").getContext("2d");
const axisOptions={
    ticks:{
        color:"white",
        maxTicksLimit :5
        
    },
    grid:{
        color: "rgba(209, 233, 236,0.2)"
    }
    
}
    let expenseChart = new Chart(expenseChartCtx, { type: 'bar', data: { labels: [], datasets: [] } ,options:{
        plugins:{
            legend:
            {labels:{
                color:"white"
            }
        }
    }, scales:{
        x: axisOptions,
        y: axisOptions
    }
}});
    let lineChart = new Chart(lineChartCtx, { type: 'line', data: { labels: [], datasets: [] } ,options:{
        plugins:{
            legend:
            {labels:{
                color:"white"
            }
        }
    }, scales:{
        x: axisOptions,
        y: axisOptions
    }
}});
    let pieChart = new Chart(pieChartCtx, { type: 'pie', data: { labels: [], datasets: [] },options:{
        plugins:{
            legend:
            {labels:{
                color:"white"
            }
        }
    }
} });

    function updateCharts() {
        const period = filterPeriod.value;
        const now = new Date();

        const filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            if (period === "week") {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(now.getDate() - 7);
                return transactionDate >= oneWeekAgo;
            } else if (period === "month") {
                return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
            } else if (period === "year") {
                return transactionDate.getFullYear() === now.getFullYear();
            }
            return true;
        }).filter(t => t.category !== "Income");

        const categories = {};
        const dateLabels = [];
        const dateData = {};

        filteredTransactions.forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
            if (!dateLabels.includes(t.date)) dateLabels.push(t.date);
            dateData[t.date] = (dateData[t.date] || 0) + t.amount;
        });

        const categoryLabels = Object.keys(categories);
        const categoryData = Object.values(categories);

        const datasets = categoryLabels.map((category, index) => ({
            label: category, 
            data: [categoryData[index]],
            backgroundColor: ["#4DB6AC", "#F06292", "#FFD54F", "#64B5F6", "#BA68C8"][index % 5],



        }));
        
        expenseChart.data = {
            labels: ["Categories"],
            datasets: datasets
        };
        
        expenseChart.update();

        lineChart.data = {
            labels: dateLabels.sort(),
            datasets: [{
                label: "Expense Over Time",
                data: dateLabels.map(date => dateData[date]),
                borderColor: "#4bc0c0",
                fill: false,
            }]
        };
        lineChart.update();

        pieChart.data = {
            labels: categoryLabels,
            datasets: [{
                label: "Expense Distribution",
                data: categoryData,
                backgroundColor: ["#4DB6AC", "#F06292", "#FFD54F", "#64B5F6", "#BA68C8"],

            }]
        };
        pieChart.update();
    }

    renderTransactions();
    updateDashboard();
});
const hamburger = document.querySelector('.hamburger');
const navMenu = document.getElementById('navi');
const line1 = document.getElementById('l1');
const line3 = document.getElementById('l3');
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    line1.classList.toggle('active');
    line3.classList.toggle('active');
    document.querySelectorAll("#navi ul li a").forEach(item => {
        item.addEventListener("click", () => {
            navMenu.classList.remove("active");
            line1.classList.remove("active");
            line3.classList.remove("active");
        });
    });
});