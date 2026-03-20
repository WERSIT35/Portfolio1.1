import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    const cardSelector = '.eduCard, .exCard, .cert-card, .project-card, .offer-card, .profile-block, .contact-panel, .contact-links a, .skill-card, .cta-card, .suggestion-card, .card';

    type CardState = {
      currentX: number;
      currentY: number;
      targetX: number;
      targetY: number;
      active: boolean;
    };

    const states = new Map<HTMLElement, CardState>();
    let rafId: number | null = null;

    const ensureState = (card: HTMLElement): CardState => {
      const existing = states.get(card);
      if (existing) return existing;

      const initial: CardState = {
        currentX: 50,
        currentY: 50,
        targetX: 50,
        targetY: 50,
        active: false,
      };
      states.set(card, initial);
      return initial;
    };

    const setCardVars = (card: HTMLElement, xPct: number, yPct: number): void => {
      const clampedX = Math.max(0, Math.min(xPct, 100));
      const clampedY = Math.max(0, Math.min(yPct, 100));

      card.style.setProperty('--mx', `${clampedX}%`);
      card.style.setProperty('--my', `${clampedY}%`);
    };

    const updateTargetFromPointer = (card: HTMLElement, clientX: number, clientY: number): void => {
      const rect = card.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

      const xPct = rect.width ? (x / rect.width) * 100 : 50;
      const yPct = rect.height ? (y / rect.height) * 100 : 50;

      const state = ensureState(card);
      state.targetX = xPct;
      state.targetY = yPct;
      state.active = true;
    };

    const tick = (): void => {
      let keepRunning = false;

      for (const [card, state] of states.entries()) {
        const ease = state.active ? 0.12 : 0.09;

        state.currentX += (state.targetX - state.currentX) * ease;
        state.currentY += (state.targetY - state.currentY) * ease;

        setCardVars(card, state.currentX, state.currentY);

        const dx = Math.abs(state.targetX - state.currentX);
        const dy = Math.abs(state.targetY - state.currentY);
        const settling = dx < 0.08 && dy < 0.08;

        if (!state.active && settling) {
          states.delete(card);
        } else {
          keepRunning = true;
        }
      }

      if (keepRunning) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const ensureLoop = (): void => {
      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    };

    document.addEventListener('pointermove', (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const card = target.closest(cardSelector);
      if (!(card instanceof HTMLElement)) return;

      updateTargetFromPointer(card, event.clientX, event.clientY);
      ensureLoop();
    });

    document.addEventListener('pointerout', (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const fromCard = target.closest(cardSelector);
      if (!(fromCard instanceof HTMLElement)) return;

      const related = event.relatedTarget;
      if (related instanceof Element && related.closest(cardSelector) === fromCard) return;

      const state = ensureState(fromCard);
      state.active = false;
      state.targetX = 50;
      state.targetY = 50;
      ensureLoop();
    });
  })
  .catch((err) => console.error(err));
