<?php require 'auth.php'; ?>

<!DOCTYPE html>
<html>
<head>
<title>Products</title>
</head>
<body>

<h1>Add Product</h1>

<input id="name" placeholder="Name">
<input id="price" placeholder="Price">
<button onclick="save()">Save</button>

<script>
function save() {
    fetch('api/save_product.php', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            name: document.getElementById('name').value,
            price: document.getElementById('price').value
        })
    }).then(()=>alert("Saved"));
}
</script>

</body>
</html>
