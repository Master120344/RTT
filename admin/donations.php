<?php require 'auth.php'; ?>

<!DOCTYPE html>
<html>
<head>
<title>Donations</title>
</head>
<body>

<h1>Donations</h1>
<table border="1" id="table"></table>

<script>
fetch('api/get_donations.php')
.then(r => r.json())
.then(data => {
    let html = "<tr><th>Email</th><th>Amount</th><th>Date</th></tr>";
    data.forEach(d => {
        html += `<tr>
            <td>${d.email}</td>
            <td>$${d.amount}</td>
            <td>${d.date}</td>
        </tr>`;
    });
    document.getElementById('table').innerHTML = html;
});
</script>

</body>
</html>
