// ==UserScript==
// @name         BadAssParser
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  huinya kakaya-to...
// @author       undefined
// @match        https://himera-search.net/report/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=himera-search.net
// @grant        none
// ==/UserScript==

(function() {
  // Получаем все элементы отчетных карточек (report-card) на странице, удовлетворяющие условиям поиска
  const reportCards = Array.from(document.querySelectorAll('.report-card')).filter(card => {
    const header = card.querySelector('h2');
    return header && (header.textContent.includes('КАДРЫ') || header.textContent.includes('ДОХОДЫ'));
  });

  // Извлекаем детали отчета из каждой отфильтрованной карточки
  const reportDetailsArray = reportCards.map(reportCard => {
      return extractReportDetails(reportCard);
  });

  // Удаляем дубликаты из массива деталей отчета
  const uniqueReportDetailsArray = [...new Set(reportDetailsArray.map(JSON.stringify))].map(JSON.parse);

  // Фильтруем массив деталей отчета
  const filteredReportDetailsArray = filterReportDetailsArray(uniqueReportDetailsArray);

  // Выводим отфильтрованные детали отчета в консоль
  filteredReportDetailsArray.forEach(reportDetails => {
    // console.log(`${reportDetails.name} ${reportDetails.birthdate}`);
    // console.log(`Сумма: ${reportDetails.income}`);
    // console.log('   ');
  });

  // Определяем функцию extractReportDetails()
  function extractReportDetails(reportCard) {
      const details = reportCard.querySelector(".report-details");
      if(details!=details){
        name = "Бомж";
        birthdate = "1.1.1920";
        income = "1200";
      }
      const filterDtByText = (text) => {
          const regex = new RegExp(text, "i");
          return [...details.querySelectorAll("dt")]
              .find(dt => regex.test(dt.textContent.trim()));
      };

      const name = filterDtByText("Имя") ? filterDtByText("Имя").nextElementSibling.textContent : "";
      const birthdate = filterDtByText("Дата рождения") ? filterDtByText("Дата рождения").nextElementSibling.textContent : "";
      const income = filterDtByText("Сумма.*") ? filterDtByText("Сумма.*").nextElementSibling.textContent : "";
      return {
          name,
          birthdate: birthdate,
          income: income
      };
  }

  // Определяем функцию filterReportDetailsArray()
  function filterReportDetailsArray(reportDetailsArray) {
      return reportDetailsArray.filter(reportDetails => {
          const birthdate = reportDetails.birthdate;
          const year = birthdate.toString().slice(-4);
          if (year < 1967 || year > 1980) {
              return false;
          }
          const income = parseInt(reportDetails.income);
          if (income <= 3500000) {
              return false;
          }
          return true;
      });
  }

  // Собираем отфильтрованные детали отчета в строку и выводим в консоль
  const filteredReportDetailsString = filteredReportDetailsArray
  .map(reportDetails => `${reportDetails.name} ${reportDetails.birthdate}\nТелефон: \nСумма: ${reportDetails.income}\n\n`)
  .join("");
  console.log("-------------------------\n\n\n"+filteredReportDetailsString)
})();
