const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Определение директорий
const baseDir = path.join(__dirname);
const contentDir = path.join(baseDir, 'content');
const imagesDir = path.join(baseDir, 'images');

if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

async function downloadImage(urlStr, filepath) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(urlStr);
      const request = https.get(parsedUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to get '${urlStr}' (${response.statusCode})`));
          return;
        }
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      });
      request.on('error', (err) => {
        reject(err);
      });
    } catch (e) {
      reject(e);
    }
  });
}

(async () => {
  console.log('Запуск браузера Chromium...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'ru-RU',
    timezoneId: 'Asia/Almaty',
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });

  // Маскировка под реальный браузер (удаление флага автоматизации)
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });
  });

  const page = await context.newPage();
  
  const visited = new Set();
  const queue = ['https://bsbnb.kz/'];
  const sitemap = [];
  const reportData = [];

  while (queue.length > 0) {
    const currentUrl = queue.shift();
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    console.log(`Сканирование страницы: ${currentUrl}`);
    try {
      await page.goto(currentUrl, { waitUntil: 'networkidle', timeout: 45000 });
      
      const urlObj = new URL(currentUrl);
      let pageName = urlObj.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'index';
      
      // Получение заголовка и тегов
      const title = await page.title();
      const headings = await page.evaluate(() => {
        const getHeadingText = (selector) => Array.from(document.querySelectorAll(selector)).map(el => el.innerText.trim()).filter(Boolean);
        return {
          h1: getHeadingText('h1'),
          h2: getHeadingText('h2'),
          h3: getHeadingText('h3')
        };
      });

      // Извлечение основного текста страницы
      const bodyText = await page.evaluate(() => {
        // Убираем элементы навигации и футер для чистоты текста
        const clone = document.body.cloneNode(true);
        const headers = clone.querySelectorAll('header, nav, footer, .footer');
        headers.forEach(el => el.remove());
        return clone.innerText.trim();
      });

      // Извлечение внутренних ссылок
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a'))
          .map(a => a.href)
          .filter(href => {
            if (!href) return false;
            try {
              const url = new URL(href, window.location.href);
              return url.hostname.endsWith('bsbnb.kz');
            } catch (e) {
              return false;
            }
          });
      });

      // Добавление новых ссылок в очередь
      for (const link of links) {
        const cleanLink = link.split('#')[0].replace(/\/$/, ''); // Убираем хэш и конечный слэш
        if (!visited.has(cleanLink) && !queue.includes(cleanLink)) {
          queue.push(cleanLink);
        }
      }

      // Извлечение вычисленных цветов (computed colors)
      const colors = await page.evaluate(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        const header = document.querySelector('header');
        const headerStyle = header ? window.getComputedStyle(header) : null;
        return {
          bodyBg: bodyStyle.backgroundColor,
          bodyColor: bodyStyle.color,
          headerBg: headerStyle ? headerStyle.backgroundColor : 'N/A',
          headerColor: headerStyle ? headerStyle.color : 'N/A'
        };
      });

      // Извлечение источников изображений
      const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .map(img => img.src)
          .filter(src => src && src.startsWith('http'));
      });

      // Загрузка изображений на диск
      const pageImagesDir = path.join(imagesDir, pageName);
      if (!fs.existsSync(pageImagesDir) && images.length > 0) {
        fs.mkdirSync(pageImagesDir, { recursive: true });
      }

      const downloadedImages = [];
      for (let i = 0; i < images.length; i++) {
        const imgUrl = images[i];
        try {
          const imgName = path.basename(new URL(imgUrl).pathname) || `image_${i}.png`;
          const imgPath = path.join(pageImagesDir, imgName);
          await downloadImage(imgUrl, imgPath);
          downloadedImages.push({ url: imgUrl, localPath: `images/${pageName}/${imgName}` });
        } catch (e) {
          console.error(`Ошибка при скачивании изображения ${imgUrl}: ${e.message}`);
        }
      }

      // Извлечение ссылок на видеоматериалы
      const videos = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('video, iframe'))
          .map(v => v.src || v.querySelector('source')?.src)
          .filter(Boolean);
      });

      // Запись в sitemap
      sitemap.push({
        url: currentUrl,
        path: urlObj.pathname,
        title: title,
        headings: headings
      });

      // Сбор данных для отчета
      reportData.push({
        url: currentUrl,
        name: pageName,
        title: title,
        headings: headings,
        bodyText: bodyText,
        colors: colors,
        images: downloadedImages,
        videos: videos
      });

      // Сохранение markdown файла страницы
      let mdContent = `# ${title}\n\n`;
      mdContent += `**URL:** [${currentUrl}](${currentUrl})\n\n`;
      
      mdContent += `## Цветовая палитра страницы (Computed Colors)\n`;
      mdContent += `- Background (Фон): \`${colors.bodyBg}\`\n`;
      mdContent += `- Text color (Цвет текста): \`${colors.bodyColor}\`\n`;
      mdContent += `- Header background (Фон шапки): \`${colors.headerBg}\`\n`;
      mdContent += `- Header text color (Цвет текста шапки): \`${colors.headerColor}\`\n\n`;

      mdContent += `## Заголовки (Headings)\n`;
      if (headings.h1.length > 0) {
        mdContent += `### H1:\n` + headings.h1.map(h => `- ${h}`).join('\n') + '\n\n';
      }
      if (headings.h2.length > 0) {
        mdContent += `### H2:\n` + headings.h2.map(h => `- ${h}`).join('\n') + '\n\n';
      }
      if (headings.h3.length > 0) {
        mdContent += `### H3:\n` + headings.h3.map(h => `- ${h}`).join('\n') + '\n\n';
      }

      mdContent += `## Содержимое страницы (Body Text)\n\n`;
      mdContent += `${bodyText}\n\n`;

      if (downloadedImages.length > 0) {
        mdContent += `## Изображения (Images)\n\n`;
        downloadedImages.forEach(img => {
          mdContent += `- ![${img.url}](../${img.localPath})\n`;
        });
        mdContent += '\n';
      }

      if (videos.length > 0) {
        mdContent += `## Видеоматериалы (Videos)\n\n`;
        videos.forEach(v => {
          mdContent += `- [${v}](${v})\n`;
        });
        mdContent += '\n';
      }

      fs.writeFileSync(path.join(contentDir, `${pageName}.md`), mdContent, 'utf-8');

    } catch (err) {
      console.error(`Ошибка при обработке ${currentUrl}: ${err.message}`);
    }
  }

  // Сохранение sitemap.json
  fs.writeFileSync(path.join(baseDir, 'sitemap.json'), JSON.stringify(sitemap, null, 2), 'utf-8');

  // Генерация BSBNB_FULL_REPORT.md
  let reportMd = `# Полный отчет по анализу и извлечению данных с сайта bsbnb.kz\n\n`;
  reportMd += `**Дата извлечения данных:** ${new Date().toLocaleString('ru-RU')}\n\n`;
  reportMd += `## Список обнаруженных страниц (Sitemap)\n\n`;
  sitemap.forEach(s => {
    reportMd += `- **[${s.title}](${s.url})** (Путь: \`${s.path}\`)\n`;
  });
  reportMd += `\n## Подробный анализ по страницам\n\n`;

  for (const pageInfo of reportData) {
    reportMd += `### Страница: ${pageInfo.title}\n`;
    reportMd += `- **URL:** [${pageInfo.url}](${pageInfo.url})\n`;
    reportMd += `- **Палитра:** Фон: \`${pageInfo.colors.bodyBg}\` | Текст: \`${pageInfo.colors.bodyColor}\`\n`;
    reportMd += `- **Количество изображений:** ${pageInfo.images.length}\n`;
    if (pageInfo.videos.length > 0) {
      reportMd += `- **Обнаружено видео:** ${pageInfo.videos.length}\n`;
    }
    reportMd += `\n`;
  }

  fs.writeFileSync(path.join(baseDir, 'BSBNB_FULL_REPORT.md'), reportMd, 'utf-8');
  console.log('Извлечение данных успешно завершено! Все файлы сохранены в папке extracted/.');

  await browser.close();
})();
