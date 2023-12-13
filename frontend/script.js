document.getElementById('conversionForm').addEventListener('submit', async function(event){
    event.preventDefault();

    const sourceCurrency = document.getElementById('sourceCurrency').value;
    const targetCurrency = document.getElementById('targetCurrency').value;
    const amount = document.getElementById('amount').value;

    const response = await fetch(`http://localhost:3000/convert?source=${sourceCurrency}&target=${targetCurrency}&amount=${amount}`);
    const data = await response.json();

    document.getElementById('result').textContent = `${amount} ${sourceCurrency} = ${data.convertedAmount} ${targetCurrency}`;
    await fetchHistory();
}) ;


async function fetchHistory(){
    const response = await fetch('/gethistory');
    const history = await response.json();

    const historyTable = document.getElementById('historyTable').querySelector('tbody');
    historyTable.innerHTML = '';

    history.forEach(entry =>{
        const row = document.createElement('tr');

        const dataCell = document.createElement('td');
        dataCell.textContent = new Date(entry.date).toLocaleString();

        const  sourceCurrencyCell = document.createElement('td');
        sourceCurrencyCell.textContent = entry.source_currency;

        const  targetCurrencyCell = document.createElement('td');
        targetCurrencyCell.textContent = entry.target_currency;

        const  sourceAmountCell = document.createElement('td');
        sourceAmountCell.textContent = entry.source_amount;

        const  targetAmountCell = document.createElement('td');
        targetAmountCell.textContent = entry.converted_amount;
        
        row.appendChild(dataCell);
        row.appendChild(sourceCurrencyCell);
        row.appendChild(targetCurrencyCell);
        row.appendChild(sourceAmountCell);
        row.appendChild(targetAmountCell);

        historyTable.appendChild(row);
    });
}

fetchHistory();