"use strict"

//Выход из личного кабинета

const logoutBut = new LogoutButton();
logoutBut.action = function () {
    return (ApiConnector.logout(() => {
      if(typeof logoutBut.action === "function"){
          location.reload();
      }
    })) 
}


//Получение информации о пользователе

ApiConnector.current((response) => {
    if(response){
        ProfileWidget.showProfile(response.data);
    }
})


//Получение текущих курсов валюты

const rates = new RatesBoard();

function ExchangeRates () {
    ApiConnector.getStocks((rate) => {
        if(rate) {
            rates.clearTable();
            rates.fillTable(rate.data);
        }
    })
}

setInterval(ExchangeRates(), 60000);


//Операции с деньгами

const operationsMoney = new MoneyManager();
operationsMoney.addMoneyCallback = (data) => {
    return ApiConnector.addMoney(data, (money) => {
        if(money.success){
            ProfileWidget.showProfile(money.data);
            operationsMoney.setMessage(money.success, 
                money.message = "Баланс успешно пополнен на " + data.amount + " " + data.currency);
                return;
        }
        operationsMoney.setMessage(money.success, money.error );
    })
}

operationsMoney.conversionMoneyCallback = (data) => {
    return ApiConnector.convertMoney(data, (conv) => {
        if(conv.success){
            ProfileWidget.showProfile(conv.data);
            operationsMoney.setMessage(conv.success, 
                conv.message = "Конвертация " + data.fromAmount + " " + data.fromCurrency + " в " 
                + data.targetCurrency + " произведена успешно");
                return;
        }
        operationsMoney.setMessage(conv.success, conv.error);
    })
}

operationsMoney.sendMoneyCallback = (data) => {
    return ApiConnector.transferMoney(data, (trans) => {
        if(trans.success){
            ProfileWidget.showProfile(trans.data);
            operationsMoney.setMessage(trans.success, 
                trans.message = "Перевод проведен успешно");
                return;
        }
        operationsMoney.setMessage(trans.success, trans.error);
    })
}


//Работа с избранным

const favorites = new FavoritesWidget();

ApiConnector.getFavorites((favorit) => {
    if(favorit.success){
        favorites.clearTable();  
        favorites.fillTable(favorit.data);
        operationsMoney.updateUsersList(favorit.data);      
    }
})

favorites.addUserCallback = (user) => {    
    return ApiConnector.addUserToFavorites(user, (addUser) => {        
        if(addUser.success) {
            favorites.clearTable();
            favorites.fillTable(addUser.data);
            operationsMoney.updateUsersList(addUser.data);
            favorites.setMessage(addUser.success, 
                addUser.message = "Добавление пользователя прошло успешно");
                return;
        }
        favorites.setMessage(addUser.success, addUser.error);
    })
}

favorites.removeUserCallback = (user) => {    
    return ApiConnector.removeUserFromFavorites(user, (delUser) => {        
        if(delUser.success) {
            favorites.clearTable();
            favorites.fillTable(delUser.data);
            operationsMoney.updateUsersList(delUser.data);
            favorites.setMessage(delUser.success, 
                addUser.message = "Удаление пользователя прошло успешно");
                return;
        }
        favorites.setMessage(delUser.success, delUser.error);
    })
}