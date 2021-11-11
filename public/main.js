const axios = window.axios;

// Connect to database
// function connectToDatabase(connectionString, isReset) {
//   return fetch(`/connect?reset=${isReset}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       connectionString,
//     }),
//   }).then(function (response) {
//     if (response === 200) {
//       return;
//     }
//     return response.json().then(function (response) {
//       throw new Error(response.error);
//     });
//   });
// }



// function connectToDatabase() {
//   return fetch(`/connect`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       connectionString,
//     }),
//   }).then(function (response) {
//     if (response.status === 200) {
//       return;
//     }
//     return response.json().then(function (response) {
//       throw new Error(response.error);
//     });
//   });
// }

// Get product
function getProducts() {
  return fetch('/api/products')
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      if (json.error) {
        console.log(json.error + 'this is the 2 error');
        throw new Error(json.error);
      }
      return json.products;
    });
}

// Add products
function addproduct(productName, quantityNum) {
  return fetch(`/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: productName,
      num: quantityNum,
    }),
  }).then(function (response) {
    console.log('this is the response' + response);
    if (response.status === 201) {
      return;
    }
    return response.json().then(function (json) {
      if (json.error) {
        throw new Error(json.error);
      }
      throw new Error(`Unexpected response body: ${JSON.stringify(json)}`);
    });
  });
}

    

function updateProductList(quantityNum, productStatus) {
  return fetch(`/api/products/test/${quantityNum}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productStatus }),
  }).then(function (response) {
    if (response.status === 200) {
      return;
    }
    return response.json().then(function (json) {
      if (json.error) {
        throw new Error(json.error);
      }
      throw new Error(`Unknown Response ${JSON.stringify(json)}`);
    });
  });
}

function deleteProductList(id) {
  return fetch(`/api/products/${id}`, {
    method: 'DELETE',
  }).then(function (response) {
    if (response.status === 200) {
      return;
    }
    return response.json().then(function (json) {
      if (json.error) {
        throw new Error(json.error);
      }
      throw new Error(`Unknown Response ${JSON.stringify(json)}`);
    });
  });
}


window.addEventListener('DOMContentLoaded', function () {
  //console.log('Hello');
  const connectionStringInput = document.getElementById('connection-string');
  const connectButton = document.getElementById('connect');
  const resetCheckbox = document.getElementById('reset');
  const productNameInput = document.getElementById('pName');
  const quantityNumInput = document.getElementById('pNum');
  const addProductButton = document.getElementById('n-Submit');
  const productTable = document.getElementById('productList');
  const rowTemplate = document.querySelector('#product-row');

  // Connection Button
  // connectButton.addEventListener('click', function () {
  //   if (!connectionStringInput.reportValidity()) {
  //     return;
  //   }
  //   const connectionString = connectionStringInput.value;
  //   const isReset = resetCheckbox.checked;
  //   connectButton.disabled = true;
  //   connectToDatabase(connectionString, isReset)
  //     .then(function () {
  //       alert('Successfully connected to Database!');
  //     })
  //     .then(function () {
  //       return refreshAttendanceTable();
  //     })
  //     .catch(function (error) {
  //       alert(error);
  //     })
  //     .finally(function () {
  //       connectButton.disabled = false;
  //     });
  // });

  connectButton.addEventListener('click', function () {
    // if (!connectionStringInput.reportValidity()) {
    //   return;
    // }
    connectButton.disabled = true;
    refreshAttendanceTable()
      .then(function () {
        alert('Successfully connected to Database!');
      })
      .then(function () {
        return refreshAttendanceTable();
      })
      .catch(function (error) {
        alert(error);
      })
      .finally(function () {
        connectButton.disabled = false;
      });
  });

  // Add product button
  addProductButton.onclick = function () {
    if (!productNameInput.reportValidity() || !quantityNumInput.reportValidity()) {
      return;
    }
    const productName = productNameInput.value;
    const quantityNum = quantityNumInput.value;
    addProductButton.disabled = true;
    addproduct(productName, quantityNum)
      .then(function () {
        alert('Successfully Added!');
      })
      .catch(function (error) {
        alert(error.message);
      })
      .finally(function () {
        refreshAttendanceTable();
        addProductButton.disabled = false;
      });
  };

  // Create product row
  function createProductRow(product) {
    
    const newRow = rowTemplate.content.cloneNode(true);
    console.log('---------------------');
    console.log(product.id);
    console.log(product.productName);
    console.log(product.quantityNum)
    console.log('---------------------');

    newRow.querySelector('.row-product-id').textContent = product.id;
    newRow.querySelector('.row-product-name').textContent = product.productName;
    newRow.querySelector('.row-product-num').textContent = product.quantityNum;

    const StatusSelect = newRow.querySelector('.row-product-status');
    StatusSelect.value = product.productStatus || '';





    // Update Row
    const updateButton = newRow.querySelector('.row-update');
    updateButton.onclick = function () {
      return updateProductList(product.quantityNum, StatusSelect.value)
        .then(function () {
          console.log(StatusSelect.value + 'this is the status');
          alert(`Update Successfully! ${product.quantityNum} -> ${StatusSelect.value}`);
          return refreshAttendanceTable();
        })  
        .catch(function (error) {
          alert(error.message);
        });
    };

    // Delete Row
    const deleteButton = newRow.querySelector('.row-delete');
    deleteButton.onclick = function () {
      return deleteProductList(product.id)
        .then(function () {
          alert(`Delete Successfully! ${product.id}`);
          return refreshAttendanceTable();
        })
        .catch(function (error) {
          alert(error.message);
        });
    };
    return newRow;
  }

  // Refresh table
  function refreshAttendanceTable() {
    return getProducts()
      .then(function (products) {
        productTable.innerHTML = '';
        products.forEach(function (product) {
          const productRow = createProductRow(product);
          productTable.appendChild(productRow);
        });
      })
      .catch(function (error) {
        console.log(error)
        return alert("kwok"+error.message);
      });
  }
});
