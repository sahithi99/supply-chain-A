function initializeGame(){
	if(localStorage.getItem('RetailerStock') == null){
		resetGame();
	}
}

function resetGame(){
	localStorage = null;
	localStorage.setItem("CustomerStock", 0);
	localStorage.setItem("BreweryStock", 500);
	localStorage.setItem("DistributorStock", 300);
	localStorage.setItem("WholesalerStock", 200);
	localStorage.setItem("RetailerStock", 100);
	localStorage.setItem("TotalPendingOrdersWithRetailer", 0);
	localStorage.setItem("TotalPendingOrdersWithWholesaler", 0);
	localStorage.setItem("TotalPendingOrdersWithDistributor", 0);
	localStorage.setItem("TotalPendingOrdersWithBrewery", 0);
	localStorage.setItem("TotalOrdersDeliveredByRetailer", 0);
	localStorage.setItem("TotalOrdersDeliveredByWholesaler", 0);
	localStorage.setItem("TotalOrdersDeliveredByDistributor", 0);
	localStorage.setItem("TotalOrdersDeliveredByBrewery", 0);
	localStorage.setItem("saleTransactions", null);
	localStorage.setItem("purchaseTransactions", null);
	localStorage.setItem("users", null);

	var statusSpan = document.getElementById("status");
	
	if(statusSpan != null && statusSpan != undefined){
		statusSpan.innerHTML = "";
	}
	
	var inputBeerUnitsElement = document.getElementById('beerUnits');

	if(inputBeerUnitsElement != null && inputBeerUnitsElement != undefined){
		inputBeerUnitsElement.innerHTML = "";
	}
	
	alert('Reset Complete.');
	window.location.href = 'login.html';
}

function placeOrder(source){
	var inputBeerUnitsElement = document.getElementById('beerUnits');
	var orderUnits = parseInt(inputBeerUnitsElement.value);
	if(Number.isNaN(orderUnits)){
		alert('Please enter a numeric value');
		return;
	} else{
		var statusSpan = document.getElementById("status");
		var totalPendingOrderWithSource = parseInt(localStorage.getItem('TotalPendingOrdersWith' + source));
		localStorage.setItem("TotalPendingOrdersWith" + source, totalPendingOrderWithSource + orderUnits);
		createTransactionForPurchase(inputBeerUnitsElement.value, source, orderUnits * 5);
		statusSpan.innerHTML = "Order placed successfully, please pay $" + (orderUnits * 5) + " at the billing counter";
		statusSpan.style.color = "white";
		inputBeerUnitsElement.value = "";
	}
	
	getTotalUnitsRequested(source);	
	getTotalUnitsReceived(source);
}

function createTransactionForPurchase(inputBeerUnitsElement, source, totalAmount){
	var purchaser = '';
	if(source == 'Retailer'){
		purchaser = 'Customer';
	} else if(source == 'Wholesaler'){
		purchaser = 'Retailer';
	} else if(source == 'Distributor' ){
		purchaser = 'Wholesaler';
	} else if(source == 'Brewery'){
		purchaser = 'Distributor';
	}
	
	var storedPurchaseTransactions = JSON.parse(localStorage.getItem("purchaseTransactions"));
	var newPurchaseTransaction = {unitsPurchased:inputBeerUnitsElement, purchasedBy:purchaser, amount : totalAmount, dateOfPurchase:new Date()};
				
	if (storedPurchaseTransactions != null){
		storedPurchaseTransactions.push(newPurchaseTransaction);
		var storedPurchaseTransactionsString = JSON.stringify(storedPurchaseTransactions);
		localStorage.setItem("purchaseTransactions", storedPurchaseTransactionsString);
	} else{
		storedPurchaseTransactions = new Array();
		storedPurchaseTransactions.push(newPurchaseTransaction);
		var storedPurchaseTransactionsString = JSON.stringify(storedPurchaseTransactions);
		localStorage.setItem("purchaseTransactions", storedPurchaseTransactionsString);
	}
	displayTransactions(purchaser);
}

function displayTransactions(purchaser){
	var storedPurchaseTransactions = JSON.parse(localStorage.getItem("purchaseTransactions"));
	var transactionDetailsTable = document.getElementById('transactionDetails');
	var transactionDetailsTableHeader = document.createElement("thead");
	var transactionDetailsTableHeaderRow = document.createElement("tr");

	var transactionDetailsTableBody = document.createElement('tbody');

	transactionDetailsTable.innerHTML = '';
	var transactionFound = false;

	var numberOfUnitsHeading = document.createElement("td");
	numberOfUnitsHeading.appendChild(document.createTextNode("Units Purchased"));
	transactionDetailsTableHeaderRow.appendChild(numberOfUnitsHeading);
	var totalAmountHeading = document.createElement("td");
	totalAmountHeading.appendChild(document.createTextNode("Amount"));	
	transactionDetailsTableHeaderRow.appendChild(totalAmountHeading);
	var purchaseDateHeading = document.createElement("td");
	purchaseDateHeading.appendChild(document.createTextNode("Purchase Date"));	
	transactionDetailsTableHeaderRow.appendChild(purchaseDateHeading);
	
	transactionDetailsTableHeader.appendChild(transactionDetailsTableHeaderRow);
	transactionDetailsTable.appendChild(transactionDetailsTableHeader);

	if(storedPurchaseTransactions != null){
		$.each(storedPurchaseTransactions, function(key,value) {
		  if(value.purchasedBy == purchaser){
			
			var row = document.createElement('tr');
			var numberOfUnits = document.createElement('td');
			numberOfUnits.appendChild(document.createTextNode(value.unitsPurchased));
			row.appendChild(numberOfUnits);
			var totalAmount = document.createElement('td');
			totalAmount.appendChild(document.createTextNode('$ ' + value.amount));
			row.appendChild(totalAmount);
			
			var purchaseDate = document.createElement('td');
			purchaseDate.appendChild(document.createTextNode(value.dateOfPurchase));
			row.appendChild(purchaseDate);
			
			transactionDetailsTableBody.appendChild(row);
			transactionFound = true;
		  }
		  
		  if(transactionFound == true){
			transactionDetailsTable.appendChild(transactionDetailsTableBody);
		  }
		});
	}
}

function getTotalUnitsRequested(source){
	var inputBeerUnitsRequestedElement = document.getElementById('beerUnitsRequested');
	var totalUnitsRequested = parseInt(localStorage.getItem('TotalPendingOrdersWith' + source));
	
	if(inputBeerUnitsRequestedElement != null && inputBeerUnitsRequestedElement != undefined){
		inputBeerUnitsRequestedElement.innerHTML = totalUnitsRequested;
	}
}

function getTotalUnitsReceived(source){
	var inputBeerUnitsReceivedElement = document.getElementById('beerUnitsReceived');
	var totalUnitsReceived = parseInt(localStorage.getItem('TotalOrdersDeliveredBy' + source));
	
	if(inputBeerUnitsReceivedElement != null && inputBeerUnitsReceivedElement != undefined){
		inputBeerUnitsReceivedElement.innerHTML = totalUnitsReceived;
	}
}

function getTotalUnitsDelivered(source){
	var inputBeerUnitsDeliveredElement = document.getElementById('beerUnitsDelivered');
	var totalUnitsDelivered = parseInt(localStorage.getItem('TotalOrdersDeliveredBy' + source));
	
	if(inputBeerUnitsDeliveredElement != null && inputBeerUnitsDeliveredElement != undefined){
		inputBeerUnitsDeliveredElement.innerHTML = totalUnitsDelivered;
	}
}

function showCurrentStock(source){
	var currentStockElement = document.getElementById('currentStock');
	var currentStock = parseInt(localStorage.getItem(source + 'Stock'));
	
	if(currentStockElement != null && currentStockElement != undefined){
		currentStockElement.innerHTML = currentStock;
	}
}

function getTotalUnitsPending(source){
	var inputBeerUnitsPendingElement = document.getElementById('beerUnitsPending');
	var totalUnitsPending = parseInt(localStorage.getItem('TotalPendingOrdersWith' + source));
	
	if(inputBeerUnitsPendingElement != null && inputBeerUnitsPendingElement != undefined){
		inputBeerUnitsPendingElement.innerHTML = totalUnitsPending;
	}
}

function fulfillRequest(source){
	var beerUnitsToSupplyElement = document.getElementById('beerUnitsToSupply');
	var unitsToBeSupplied = parseInt(beerUnitsToSupplyElement.value);

	var totalUnitsPending = parseInt(localStorage.getItem('TotalPendingOrdersWith' + source));
	
	var totalUnitsDelivered = parseInt(localStorage.getItem('TotalOrdersDeliveredBy' + source));
	
	localStorage.setItem('TotalPendingOrdersWith' + source, totalUnitsPending - unitsToBeSupplied);
	
	localStorage.setItem('TotalOrdersDeliveredBy' + source, totalUnitsDelivered + unitsToBeSupplied);
	
	var currentStock = 0;
	
	if(source == 'Retailer')
	{
		currentStock = parseInt(localStorage.getItem('CustomerStock'));
		localStorage.setItem('CustomerStock', currentStock + unitsToBeSupplied);
		
		currentStock = parseInt(localStorage.getItem('RetailerStock'));
		localStorage.setItem('RetailerStock', currentStock - unitsToBeSupplied);
	}
	else if(source == 'Wholesaler')
	{
		currentStock = parseInt(localStorage.getItem('RetailerStock'));
		localStorage.setItem('RetailerStock', currentStock + unitsToBeSupplied);
		
		currentStock = parseInt(localStorage.getItem('WholesalerStock'));
		localStorage.setItem('WholesalerStock', currentStock - unitsToBeSupplied);
	}
	else if(source == 'Distributor')
	{
		currentStock = parseInt(localStorage.getItem('WholesalerStock'));;
		localStorage.setItem('WholesalerStock', currentStock + unitsToBeSupplied);
		
		currentStock = parseInt(localStorage.getItem('DistributorStock'));
		localStorage.setItem('DistributorStock', currentStock - unitsToBeSupplied);
	}
	else if(source == 'Brewery')
	{
		currentStock = parseInt(localStorage.getItem('DistributorStock'));
		localStorage.setItem('DistributorStock', currentStock + unitsToBeSupplied);
		
		currentStock = parseInt(localStorage.getItem('BreweryStock'));
		localStorage.setItem('BreweryStock', currentStock - unitsToBeSupplied);
	}
	createTransactionForSale(unitsToBeSupplied, source, unitsToBeSupplied * 5);
	var statusSpan = document.getElementById("supplyStatus");
	statusSpan.innerHTML = unitsToBeSupplied + " units supplied successfully";
	statusSpan.style.color = "white";
	beerUnitsToSupplyElement.value = "";
	location.reload();
}

function createTransactionForSale(inputBeerUnitsElement, source, totalAmount){
	var seller = source;
	
	var storedSalesTransactions = JSON.parse(localStorage.getItem("saleTransactions"));
	var newSalesTransaction = {unitsSold:inputBeerUnitsElement, soldBy:seller, amount : totalAmount, dateOfSale:new Date()};
				
	if (storedSalesTransactions != null){
		storedSalesTransactions.push(newSalesTransaction);
		var storedSalesTransactionsString = JSON.stringify(storedSalesTransactions);
		localStorage.setItem("saleTransactions", storedSalesTransactionsString);
	} else{
		storedSalesTransactions = new Array();
		storedSalesTransactions.push(newSalesTransaction);
		var storedSalesTransactionsString = JSON.stringify(storedSalesTransactions);
		localStorage.setItem("saleTransactions", storedSalesTransactionsString);
	}
	displaySalesTransactions(seller);
}

function displaySalesTransactions(seller){
	var storedSaleTransactions = JSON.parse(localStorage.getItem("saleTransactions"));
	var transactionDetailsTable = document.getElementById('saleTransactionDetails');
	var transactionDetailsTableHeader = document.createElement("thead");
	var transactionDetailsTableHeaderRow = document.createElement("tr");

	var transactionDetailsTableBody = document.createElement('tbody');

	transactionDetailsTable.innerHTML = '';
	var transactionFound = false;

	var numberOfUnitsHeading = document.createElement("td");
	numberOfUnitsHeading.appendChild(document.createTextNode("Units Sold"));
	transactionDetailsTableHeaderRow.appendChild(numberOfUnitsHeading);
	var totalAmountHeading = document.createElement("td");
	totalAmountHeading.appendChild(document.createTextNode("Amount"));	
	transactionDetailsTableHeaderRow.appendChild(totalAmountHeading);
	var soldDateHeading = document.createElement("td");
	soldDateHeading.appendChild(document.createTextNode("Sold On"));	
	transactionDetailsTableHeaderRow.appendChild(soldDateHeading);
	
	transactionDetailsTableHeader.appendChild(transactionDetailsTableHeaderRow);
	transactionDetailsTable.appendChild(transactionDetailsTableHeader);

	if(storedSaleTransactions != null){
		$.each(storedSaleTransactions, function(key,value) {
		  if(value.soldBy == seller){
			
			var row = document.createElement('tr');
			var numberOfUnits = document.createElement('td');
			numberOfUnits.appendChild(document.createTextNode(value.unitsSold));
			row.appendChild(numberOfUnits);
			var totalAmount = document.createElement('td');
			totalAmount.appendChild(document.createTextNode('$ ' + value.amount));
			row.appendChild(totalAmount);
			
			var saleDate = document.createElement('td');
			saleDate.appendChild(document.createTextNode(value.dateOfSale));
			row.appendChild(saleDate);
			
			transactionDetailsTableBody.appendChild(row);
			transactionFound = true;
		  }
		  
		  if(transactionFound == true){
			transactionDetailsTable.appendChild(transactionDetailsTableBody);
		  }
		});
	}
}

