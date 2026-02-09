let payrollData = {};

function calculate() {
  const ctc = Number(document.getElementById("ctc").value);
  const state = document.getElementById("state").value;

  const monthlyCTC = ctc / 12;
  const basic = monthlyCTC * 0.4;
  const hra = basic * 0.4;
  const gross = basic + hra;

  const pf = basic * 0.12;
  const esic = gross <= 21000 ? gross * 0.0075 : 0;
  const pt = getPT(state, gross);

  const net = gross - (pf + esic + pt);

  payrollData = { basic, hra, gross, pf, esic, pt, net };

  updateUI();
}

function getPT(state, salary) {
  if (state === "MH") return salary > 10000 ? 200 : 0;
  if (state === "KA") return 200;
  if (state === "TN") return salary > 21000 ? 208 : 0;
  return 0;
}

function updateUI() {
  for (let key in payrollData) {
    document.getElementById(key).innerText =
      "₹" + Math.round(payrollData[key]).toLocaleString();
  }
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Salary Slip - Mine HR Solutions", 20, 20);
  let y = 40;

  for (let key in payrollData) {
    doc.text(`${key.toUpperCase()}: ₹${Math.round(payrollData[key])}`, 20, y);
    y += 10;
  }

  doc.save("salary-slip.pdf");
}
