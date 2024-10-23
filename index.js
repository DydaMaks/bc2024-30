const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .requiredOption('-i, --input <path>', 'шлях до файлу для читання')
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);

const options = program.opts();

// Перевірка чи існує вхідний файл
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Читання даних з JSON синхронно
try {
  const data = fs.readFileSync(options.input, 'utf8');
  const jsonData = JSON.parse(data);

  // Фільтрація даних, де значення parent === "BS3_BanksLiab"
  const filteredData = jsonData.filter(item => item.parent === 'BS3_BanksLiab');

  // Форматування результату
  const result = filteredData.map(item => `${item.indicator}: ${item.value}`).join('\n');

  // Якщо задано параметр --display, виводимо результат у консоль
  if (options.display) {
    console.log(result);
  }

  // Якщо задано параметр --output, записуємо результат у файл
  if (options.output) {
    fs.writeFileSync(options.output, result, 'utf8');
    console.log(`Результат записано у файл ${options.output}`);
  }

} catch (err) {
  console.error("Помилка при обробці файлу:", err.message);
  process.exit(1);
}
