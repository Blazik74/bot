import { CSSTransition, TransitionGroup } from 'react-transition-group';

<Card active={selected === 'targetolog'}>ИИ Таргетолог</Card>

// Для подсветки вкладки 'ИИ Центр' при открытой странице тарифов:
const isTariffsPage = location.pathname === '/tariffs';
<BottomNav active={selected === 'center' || isTariffsPage ? 'center' : selected} />

// Для анимаций:
<TransitionGroup>
  <CSSTransition key={location.key} classNames="page" timeout={300}>
    <Routes location={location}>
      {/* ... */}
    </Routes>
  </CSSTransition>
</TransitionGroup>

// Добавить CSS для .page-enter, .page-enter-active, .page-exit, .page-exit-active 