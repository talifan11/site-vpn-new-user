import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, ArrowLeft, Check, Terminal, Server, Users, Zap } from 'lucide-react';

const steps = [
  {
    id: 'welcome',
    title: 'Добро пожаловать',
    icon: Zap,
    content: {
      heading: 'Что такое DevOps Hub',
      text: 'DevOps Hub — это социальная сеть для инженеров, работающих с Linux, DevOps и инфраструктурой. Здесь вы найдёте проверенные инструкции, сможете задавать вопросы и делиться опытом с коллегами.',
      points: [
        'Пошаговые гайды по настройке VPS и VPN',
        'Сравнение хостингов с реальными данными',
        'Форум с ответами от опытных инженеров',
        'Система репутации — ваш опыт виден всем'
      ]
    }
  },
  {
    id: 'audience',
    title: 'Для кого',
    icon: Users,
    content: {
      heading: 'Это сообщество для вас, если',
      text: 'Неважно, новичок вы или эксперт. Здесь каждый найдёт полезное.',
      points: [
        'Новичок — хотите разобраться с Linux и VPN с нуля',
        'Разработчик — нужно поднять свой сервер или VPN',
        'Сисадмин — ищете готовые решения и best practices',
        'DevOps-инженер — хотите делиться опытом и помогать другим'
      ]
    }
  },
  {
    id: 'how-it-works',
    title: 'Как это работает',
    icon: Terminal,
    content: {
      heading: 'Три шага к результату',
      text: 'Всё просто. Читайте, пробуйте, спрашивайте.',
      points: [
        '1. Изучите гайды — все команды проверены и работают',
        '2. Задайте вопрос на форуме — получите ответ от инженеров',
        '3. Помогите другим — получите репутацию и признание сообщества'
      ]
    }
  },
  {
    id: 'reputation',
    title: 'Репутация',
    icon: Server,
    content: {
      heading: 'Система репутации (QoS)',
      text: 'Ваша репутация отражает вклад в сообщество. Чем больше помогаете — тем выше статус.',
      points: [
        'Новичок (0-199) — только начали путь',
        'Инженер (200-999) — активный участник',
        'Эксперт (1000+) — признанный специалист',
        '+5 за комментарий, +10 за решение, +2 за апвойт'
      ]
    }
  },
  {
    id: 'skills',
    title: 'Ваши навыки',
    icon: Check,
    isSkillsStep: true,
    content: {
      heading: 'Выберите ваши технологии',
      text: 'Это поможет нам рекомендовать подходящий контент и треды.'
    }
  }
];

const skillOptions = [
  'linux', 'docker', 'kubernetes', 'ansible', 'terraform',
  'wireguard', 'openvpn', 'nginx', 'postgresql', 'bash',
  'python', 'git', 'ci-cd', 'monitoring', 'aws',
  'cloud', 'networking', 'security', 'prometheus', 'grafana'
];

export function Onboarding() {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user?.skills || []);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      updateUser({ skills: selectedSkills });
      navigate('/profile');
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const Icon = step.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 fade-in-up">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Шаг {currentStep + 1} из {steps.length}
          </span>
          <Link 
            to="/profile" 
            className="text-xs" 
            style={{ color: 'var(--color-text-muted)' }}
          >
            Пропустить
          </Link>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
          <div 
            className="h-full rounded-full transition-all duration-300" 
            style={{ 
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              backgroundColor: 'var(--color-accent)'
            }} 
          />
        </div>
      </div>

      {/* Step content */}
      <div className="p-8 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
            <Icon size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            {step.content.heading}
          </h1>
        </div>

        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          {step.content.text}
        </p>

        {step.isSkillsStep ? (
          <div className="flex flex-wrap gap-2">
            {skillOptions.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className="text-xs px-3 py-1.5 rounded-md transition-all hover:scale-105"
                style={{
                  backgroundColor: selectedSkills.includes(skill) ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                  color: selectedSkills.includes(skill) ? 'white' : 'var(--color-accent)',
                  border: `1px solid ${selectedSkills.includes(skill) ? 'var(--color-accent)' : 'var(--color-border)'}`
                }}
              >
                {skill}
              </button>
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {step.content.points?.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <Check size={12} style={{ color: 'var(--color-accent)' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {point}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-[1.02] disabled:opacity-30 disabled:hover:scale-100"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft size={16} />
          Назад
        </button>
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
        >
          {isLast ? 'Завершить' : 'Далее'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
