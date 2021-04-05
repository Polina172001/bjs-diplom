'use strict';

// Выход из кабинета

const logoutButton = new LogoutButton();

logoutButton.action = function() {
  ApiConnector.logout (response => {
    if (response.success) {
      location.reload();
    }
  })
}

// Получение информации о пользователе
ApiConnector.current(response => {
  if(response.success) {
    ProfileWidget.showProfile(response.data);
  }
})

// Получение текущих курсов валюты
const ratesBoard = new RatesBoard();

function GetCurrencyRate() {
  ApiConnector.getStocks(response => {
    if(response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  })
}

setInterval(GetCurrencyRate(), 6000);

// Операции с деньгами

const moneyManager = new MoneyManager();

// пополнение баланса
moneyManager.addMoneyCallback = function (data) {
  ApiConnector.addMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "пополнение баланса выполнено");
    } else {
      moneyManager.setMessage(response.success, response.data);
    }
  });

}

// конвертирование валюты
moneyManager.conversionMoneyCallback = function (data) {
  ApiConnector.convertMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "конвертция выполнена успешно");
    } else {
      moneyManager.setMessage(response.success, response.data);
    }
  })
  
}

// перевод валюты
moneyManager.sendMoneyCallback = function(data) {
  ApiConnector.transferMoney (data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "перевод валюты выполнен успешно");
    } else {
      moneyManager.setMessage(response.success, response.data);
    }
  })
}

// Работа с избранным

const favoritesWidget = new FavoritesWidget();

// Запросите начальный список избранного
ApiConnector.getFavorites(response => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

// добавления пользователя в список избранных
favoritesWidget.addUserCallback = function(data) {
  ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, "пользователь успешно добавлен в избранное");
    } else {
      favoritesWidget.setMessage(response.success, response.data);
    }
  })
}

// удаление пользователя из избранного
favoritesWidget.removeUserCallback = function(data) {
  ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, "пользователь успешно удален из избранного");
    } else {
      favoritesWidget.setMessage(response.success, response.data);
    }
  })
}

