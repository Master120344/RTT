
// navigation
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// fake stats
document.getElementById('total').innerText = "$12,450";
document.getElementById('orders').innerText = "34";

// donations data
const donations = [
    {email:"test@gmail.com", amount:250, date:"2026-04-10"},
    {email:"user@gmail.com", amount:100, date:"2026-04-09"}
];

let table = "<tr><th>Email</th><th>Amount</th><th>Date</th></tr>";
donations.forEach(d => {
    table += `<tr>
        <td>${d.email}</td>
        <td>$${d.amount}</td>
        <td>${d.date}</td>
    </tr>`;
});
document.getElementById('donationTable').innerHTML = table;


// products (stored in browser)
function loadProducts() {
    let data = JSON.parse(localStorage.getItem("products") || "[]");
    let html = "";
    data.forEach(p => {
        html += `<div>${p.name} - $${p.price}</div>`;
    });
    document.getElementById('productList').innerHTML = html;
}

function addProduct() {
    let name = document.getElementById('name').value;
    let price = document.getElementById('price').value;

    let data = JSON.parse(localStorage.getItem("products") || "[]");

    data.push({name, price});
    localStorage.setItem("products", JSON.stringify(data));

    loadProducts();
}

loadProducts();
