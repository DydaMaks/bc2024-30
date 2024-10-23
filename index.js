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

// Читання даних з JSON
fs.readFile(options.input, 'utf8', (err, data) => {
  if (err) {
    console.error("Помилка при читанні файлу:", err);
    process.exit(1);
  }

  const result = JSON.parse(data);

  // Якщо задано параметр --display, виводимо в консоль
  if (options.display) {
    console.log(result);
  }

  // Якщо задано параметр --output, записуємо результат у файл
  if (options.output) {
    fs.writeFile(options.output, JSON.stringify(result, null, 2), (err) => {
      if (err) {
        console.error("Помилка при записі файлу:", err);
        process.exit(1);
      }
      console.log(`Результат записано у файл ${options.output}`);
    });
  }
});
