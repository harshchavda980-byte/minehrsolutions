function calculateSalary() {
  let basic = Number(document.getElementById("basic").value) || 0;
  let hra = Number(document.getElementById("hra").value) || 0;
  let allowances = Number(document.getElementById("allowances").value) || 0;
  let deductions = Number(document.getElementById("deductions").value) || 0;

  let grossSalary = basic + hra + allowances;
  let netSalary = grossSalary - deductions;

  document.getElementById("gross").innerText = "₹" + grossSalary.toLocaleString();
  document.getElementById("totalDeduction").innerText = "₹" + deductions.toLocaleString();
  document.getElementById("netSalary").innerText = "₹" + netSalary.toLocaleString();
}
