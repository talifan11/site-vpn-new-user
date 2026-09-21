import { Mail } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 fade-in-up">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>О сайте</h1>

      <div className="prose">
        <h2>Зачем этот сайт</h2>
        <p>
          Информация о настройке VPN разбросана по форумам, блогам и устаревшим статьям.
          Часть гайдов не работает, часть не учитывает особенности российских хостингов.
          Этот сайт собирает проверенные инструкции в одном месте с актуальными данными о блокировках портов.
        </p>

        <h2>Для кого</h2>
        <p>
          Для тех, кому нужен рабочий VPN-сервер, но кто не хочет разбираться в нюансах каждого хостинга
          и протокола. Разработчики, системные администраторы, технические специалисты.
        </p>

        <h2>Как обновляется информация</h2>
        <p>
          Данные о хостингах проверяются при каждом значимом изменении их политики.
          Гайды тестируются на актуальных версиях Ubuntu и VPN-серверов.
          Если вы заметили неточность — напишите на почту.
        </p>

        <h2>Технологии</h2>
        <p>
          Сайт построен на React и Tailwind CSS. Контент хранится в структурированном виде
          и может быть обновлён без изменения компонентов. Форум содержит предзаполненные треды
          с реальными вопросами и ответами из практики.
        </p>

        <h2>Дисклеймер</h2>
        <p>
          Данные о хостингах (блокировки портов, наличие панелей firewall, условия поддержки)
          могут меняться. Всегда проверяйте актуальную информацию в официальной документации
          хостинг-провайдера. Команды в гайдах проверены на Ubuntu 22.04 — на других версиях
          или дистрибутивах могут потребоваться корректировки.
        </p>
      </div>

      <div className="mt-12 p-6 rounded-lg border transition-all hover:translate-x-1" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Обратная связь</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Нашли ошибку, хотите предложить тему для гайда или сообщить об изменении политики хостинга.
        </p>
        <a
          href="mailto:feedback@vps-vpn.guide"
          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md border transition-all hover:scale-105"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          <Mail size={16} />
          feedback@vps-vpn.guide
        </a>
      </div>
    </div>
  );
}
