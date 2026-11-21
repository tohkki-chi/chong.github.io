const modes = {
  temp: {
    a: { label: "Celsius", symbol: "°C", placeholder: "0" },
    b: { label: "Fahrenheit", symbol: "°F", placeholder: "32" },
    aToB: (c) => (c * 9) / 5 + 32,
    bToA: (f) => ((f - 32) * 5) / 9,
  },
  length: {
    a: { label: "Meters", symbol: "m", placeholder: "1" },
    b: { label: "Feet", symbol: "ft", placeholder: "3.28" },
    aToB: (m) => m * 3.28084,
    bToA: (ft) => ft / 3.28084,
  },
};

let current = "temp";

let lastTyped = "A";

const inputA = document.getElementById("inputA");
const inputB = document.getElementById("inputB");
const tabs = document.querySelectorAll(".tab");

function format(n) {
  return String(Math.round(n * 100) / 100);
}

function setMode(mode) {
  current = mode;
  const m = modes[mode];

  document.getElementById("labelA").textContent = m.a.label;
  document.getElementById("labelB").textContent = m.b.label;
  document.getElementById("unitA").textContent = m.a.symbol;
  document.getElementById("unitB").textContent = m.b.symbol;
  inputA.placeholder = m.a.placeholder;
  inputB.placeholder = m.b.placeholder;

  tabs.forEach((t) => t.classList.toggle("active", t.dataset.mode === mode));
  clearAll();
}

function clearAll() {
  inputA.value = "";
  inputB.value = "";
  lastTyped = "A";
}

inputA.addEventListener("input", () => {
  lastTyped = "A";
});

inputB.addEventListener("input", () => {
  lastTyped = "B";
});


document.getElementById("convert").addEventListener("click", () => {
  if (lastTyped === "A") {
    // Convert box A -> box B
    if (inputA.value === "") { clearAll(); return; }
    const result = modes[current].aToB(parseFloat(inputA.value));
    inputB.value = format(result);
  } else {
    // Convert box B -> box A
    if (inputB.value === "") { clearAll(); return; }
    const result = modes[current].bToA(parseFloat(inputB.value));
    inputA.value = format(result);
  }
});

tabs.forEach((t) => t.addEventListener("click", () => setMode(t.dataset.mode)));
document.getElementById("clear").addEventListener("click", clearAll);

setMode("temp");




// income tax calc
const taxIncomeBox = document.getElementById("taxIncome");
const taxMessage   = document.getElementById("taxMessage");
const taxResult    = document.getElementById("taxResult");

const taxBracket     = document.getElementById("taxBracket");
const taxBasic       = document.getElementById("taxBasic");
const taxRate        = document.getElementById("taxRate");
const taxExcessLabel = document.getElementById("taxExcessLabel");
const taxExcess      = document.getElementById("taxExcess");
const taxTotal       = document.getElementById("taxTotal");


function peso(amount) {
  return "₱" + amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}


// computation
function computeTax() {
  taxMessage.textContent = "";

  if (taxIncomeBox.value === "") {
    taxResult.hidden = true;
    taxMessage.textContent = "Please enter the taxable income.";
    return;
  }

  const income = Number(taxIncomeBox.value);

  if (income < 0) {
    taxResult.hidden = true;
    taxMessage.textContent = "Taxable income cannot be negative.";
    return;
  }

  let lowerLimit;   // the "excess over" amount
  let basicTax;     // the fixed part of the tax
  let ratePercent;  // the % charged on the excess
  let bracketText;  // text shown in the result

  if (income <= 250000) {
    lowerLimit = 0;
    basicTax = 0;
    ratePercent = 0;
    bracketText = "Up to ₱250,000";
  } else if (income <= 400000) {
    lowerLimit = 250000;
    basicTax = 0;
    ratePercent = 20;
    bracketText = "₱250,000 – ₱400,000";
  } else if (income <= 800000) {
    lowerLimit = 400000;
    basicTax = 30000;
    ratePercent = 25;
    bracketText = "₱400,000 – ₱800,000";
  } else if (income <= 2000000) {
    lowerLimit = 800000;
    basicTax = 130000;
    ratePercent = 30;
    bracketText = "₱800,000 – ₱2,000,000";
  } else if (income <= 8000000) {
    lowerLimit = 2000000;
    basicTax = 490000;
    ratePercent = 32;
    bracketText = "₱2,000,000 – ₱8,000,000";
  } else {
    lowerLimit = 8000000;
    basicTax = 2410000;
    ratePercent = 35;
    bracketText = "Over ₱8,000,000";
  }

  const excess = income - lowerLimit;
  const incomeTax = basicTax + excess * (ratePercent / 100);

  taxBracket.textContent = bracketText;
  taxBasic.textContent = peso(basicTax);
  taxRate.textContent = ratePercent + "%";
  taxExcessLabel.textContent = "Excess over " + peso(lowerLimit);
  taxExcess.textContent = peso(excess);
  taxTotal.textContent = peso(incomeTax);
  taxResult.hidden = false;
}

function clearTax() {
  taxIncomeBox.value = "";
  taxMessage.textContent = "";
  taxResult.hidden = true;
}


// buttons
document.getElementById("taxCompute").addEventListener("click", computeTax);
document.getElementById("taxClear").addEventListener("click", clearTax);

taxIncomeBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    computeTax();
  }
});


// factorial
const factInput   = document.getElementById("factInput");
const factMessage = document.getElementById("factMessage");
const factResult  = document.getElementById("factResult");

const factValue = document.getElementById("factValue");
const sumValue  = document.getElementById("sumValue");
const avgValue  = document.getElementById("avgValue");

function getFactorial(n) {
  // BigInt (the "n" after the number) can hold very large whole numbers.
  // A normal number gets inaccurate once the answer is too big.
  let factorial = 1n;
  let i = 1;

  while (i <= n) {
    factorial = factorial * BigInt(i);
    i++;
  }

  return factorial;
}

function getSum(n) {
  let sum = 0;
  let i = 1;

  do {
    sum = sum + i;
    i++;
  } while (i <= n);

  return sum;
}

function getAverage(n) {
  let total = 0;

  for (let i = 1; i <= n; i++) {
    total = total + i;
  }

  return total / n;
}


// computation
function computeFactorialSumAverage() {
  factMessage.textContent = "";

  if (factInput.value === "") {
    factResult.hidden = true;
    factMessage.textContent = "Please enter a value for N.";
    return;
  }

  const n = Number(factInput.value);

  if (!Number.isInteger(n) || n < 1 || n > 100) {
    factResult.hidden = true;
    factMessage.textContent = "N must be a whole number from 1 to 100.";
    return;
  }

  const factorial = getFactorial(n);
  const sum = getSum(n);
  const average = getAverage(n);

  factValue.textContent = factorial.toLocaleString("en-US");
  sumValue.textContent = sum.toLocaleString("en-US");
  avgValue.textContent = average.toLocaleString("en-US", { maximumFractionDigits: 2 });
  factResult.hidden = false;
}

function clearFactorial() {
  factInput.value = "";
  factMessage.textContent = "";
  factResult.hidden = true;
}


// buttons
document.getElementById("factCompute").addEventListener("click", computeFactorialSumAverage);
document.getElementById("factClear").addEventListener("click", clearFactorial);

factInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    computeFactorialSumAverage();
  }
});

// payroll
const payName      = document.getElementById("payName");
const payDays      = document.getElementById("payDays");
const payRate      = document.getElementById("payRate");
const payDeduction = document.getElementById("payDeduction");

const payMessage       = document.getElementById("payMessage");
const payDeleteMessage = document.getElementById("payDeleteMessage");
const payDeleteLine    = document.getElementById("payDeleteLine");
const payrollBody      = document.getElementById("payrollBody");

let employees = [];

// functions
function roundMoney(amount) {
  return Math.round(amount * 100) / 100;
}

function addCell(row, text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  row.appendChild(cell);
}

function clearPayrollForm() {
  payName.value = "";
  payDays.value = "";
  payRate.value = "";
  payDeduction.value = "";
}


// table
function showPayrollTable() {
  payrollBody.textContent = "";   

  if (employees.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.className = "empty-row";

    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 7;
    emptyCell.textContent = "No employees yet.";

    emptyRow.appendChild(emptyCell);
    payrollBody.appendChild(emptyRow);
    return;
  }

  for (let i = 0; i < employees.length; i++) {
    const employee = employees[i];

    const grossPay = roundMoney(employee.days * employee.rate);   
    const netPay = roundMoney(grossPay - employee.deduction);     

    const row = document.createElement("tr");

    addCell(row, i + 1);                                  
    addCell(row, employee.name);
    addCell(row, employee.days.toLocaleString("en-US", { maximumFractionDigits: 2 }));
    addCell(row, peso(employee.rate));                     
    addCell(row, peso(grossPay));
    addCell(row, peso(employee.deduction));
    addCell(row, peso(netPay));

    payrollBody.appendChild(row);
  }
}


// add employee

function addEmployee() {
  payMessage.textContent = "";
  payDeleteMessage.textContent = "";

  const name = payName.value.trim();

  // Check that everything was filled in
  if (name === "") {
    payMessage.textContent = "Please enter the employee name.";
    return;
  }

  if (payDays.value === "" || payRate.value === "" || payDeduction.value === "") {
    payMessage.textContent = "Please fill in days worked, daily rate and deduction amount.";
    return;
  }

  const days = Number(payDays.value);
  const rate = Number(payRate.value);
  const deduction = Number(payDeduction.value);

  if (days < 0 || rate < 0 || deduction < 0) {
    payMessage.textContent = "Days worked, daily rate and deduction cannot be negative.";
    return;
  }

  const grossPay = roundMoney(days * rate);
  if (deduction > grossPay) {
    payMessage.textContent = "The deduction cannot be more than the gross pay (" + peso(grossPay) + ").";
    return;
  }

  employees.push({ name: name, days: days, rate: rate, deduction: deduction });
  showPayrollTable();

  payMessage.textContent = name + " was added as line " + employees.length + ".";
  clearPayrollForm();
  payName.focus();
}


// delete employee
function deleteEmployee() {
  payMessage.textContent = "";
  payDeleteMessage.textContent = "";

  if (employees.length === 0) {
    payDeleteMessage.textContent = "The payroll list is empty. There is nothing to delete.";
    return;
  }

  if (payDeleteLine.value === "") {
    payDeleteMessage.textContent = "Please enter the line number to delete.";
    return;
  }

  const lineNumber = Number(payDeleteLine.value);

  if (!Number.isInteger(lineNumber) || lineNumber < 1 || lineNumber > employees.length) {
    payDeleteMessage.textContent = "Line number must be a whole number from 1 to " + employees.length + ".";
    return;
  }

  // Remove that employee (line 1 is position 0 in the list)
  const removed = employees.splice(lineNumber - 1, 1)[0];
  showPayrollTable();

  payDeleteMessage.textContent = "Line " + lineNumber + " (" + removed.name + ") was deleted.";
  payDeleteLine.value = "";
}

// buttons
document.getElementById("payAdd").addEventListener("click", addEmployee);
document.getElementById("payDelete").addEventListener("click", deleteEmployee);

document.getElementById("payClear").addEventListener("click", function () {
  clearPayrollForm();
  payMessage.textContent = "";
});

[payName, payDays, payRate, payDeduction].forEach(function (box) {
  box.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addEmployee();
    }
  });
});

payDeleteLine.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    deleteEmployee();
  }
});

showPayrollTable();