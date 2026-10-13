<?php require 'auth.php'; ?>

<!DOCTYPE html>
<html>
<head>
<title>Dashboard</title>

<style>
body {margin:0;font-family:Arial;display:flex;}
.sidebar {width:220px;background:#111;color:white;height:100vh;padding:20px;}
.sidebar a {display:block;color:white;margin:15px 0;text-decoration:none;}
.main {flex:1;padding:30px;}
.card {background:#f5f5f5;padding:20px;margin:10px;display:inline-block;width:200px;border-radius:10px;}
</style>

</head>
<body>

<div class="sidebar">
    <h2>Admin</h2>
    <a href="dashboard.php">Dashboard</a>
    <a href="donations.php">Donations</a>
    <a href="products.php">Products</a>
    <a href="logout.php">Logout</a>
</div>

<div class="main">

<h1>Dashboard</h1>
<div id="stats"></div>

<script>
fetch('api/get_stats.php')
.then(r => r.json())
.then(data => {
    document.getElementById('stats').innerHTML = `
        <div class="card">Total Donations<br>$${data.total}</div>
        <div class="card">Today<br>$${data.today}</div>
        <div class="card">Orders<br>${data.orders}</div>
    `;
});
</script>

</div>
</body>
</html>
