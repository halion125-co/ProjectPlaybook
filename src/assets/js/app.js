/**
 * KT Delivery Way Platform - Core App Module
 */

const KTDeliveryWay = (() => {
  // ── State ──────────────────────────────────────────────────────────────
  const state = {
    currentPage: 'dashboard',
    currentProject: null,
    currentPhase: null,
    currentTab: null,
  };

  // ── Navigation ─────────────────────────────────────────────────────────
  function navigateTo(page, params = {}) {
    state.currentPage = page;
    Object.assign(state, params);

    document.querySelectorAll('.sidebar-nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });

    const contentEl = document.getElementById('app-content');
    if (contentEl) {
      contentEl.src = `pages/${page}/index.html`;
    }
    if (window.location.hash !== `#${page}`) {
      window.history.pushState({ page, ...params }, '', `#${page}`);
    }
  }

  // ── Badge helper ───────────────────────────────────────────────────────
  function getStatusBadge(status) {
    const map = {
      normal:   { cls: 'badge-normal',   label: '정상' },
      caution:  { cls: 'badge-caution',  label: '주의' },
      danger:   { cls: 'badge-danger',   label: '위험' },
      critical: { cls: 'badge-danger',   label: '심각' },
    };
    const s = map[status] || { cls: 'badge-neutral', label: status };
    return `<span class="badge ${s.cls}">${s.label}</span>`;
  }

  function getGateBadge(gate) {
    const map = {
      pass:        { cls: 'badge-gate-pass',        label: '통과' },
      conditional: { cls: 'badge-gate-conditional', label: '조건부 진행' },
      fail:        { cls: 'badge-gate-fail',         label: '미통과' },
      check:       { cls: 'badge-gate-check',        label: '확인필요' },
    };
    const g = map[gate] || { cls: 'badge-neutral', label: gate };
    return `<span class="badge ${g.cls}">${g.label}</span>`;
  }

  function getTaskStatusBadge(status) {
    const map = {
      '완료':           'badge-complete',
      '진행중':         'badge-inprogress',
      '준비중':         'badge-inprogress',
      '미완료':         'badge-pending',
      '미대상':         'badge-na',
      '확인필요':       'badge-needcheck',
      '반려':           'badge-rejected',
      '요청완료':       'badge-inprogress',
      '승인대기':       'badge-needcheck',
      '타시스템처리중': 'badge-ext-processing',
    };
    return `<span class="badge ${map[status] || 'badge-neutral'}">${status}</span>`;
  }

  function getPhaseColor(phaseId) {
    const colors = {
      'KTDW-00': '#546E7A',
      'KTDW-01': '#1565C0',
      'KTDW-02': '#6A1B9A',
      'KTDW-03': '#E65100',
      'KTDW-04': '#C62828',
      'KTDW-05': '#00695C',
      'KTDW-06': '#37474F',
    };
    return colors[phaseId] || '#546E7A';
  }

  // ── Progress bar helper ────────────────────────────────────────────────
  function progressBar(value, type = 'normal') {
    const cls = value >= 80 ? 'normal' : value >= 50 ? 'caution' : 'danger';
    return `
      <div style="display:flex;align-items:center;gap:8px;">
        <div class="progress-bar" style="flex:1">
          <div class="progress-bar-fill ${type === 'kt' ? 'kt-red' : cls}" style="width:${value}%"></div>
        </div>
        <span style="font-size:11px;font-weight:700;color:var(--gray-700);width:30px;text-align:right">${value}%</span>
      </div>`;
  }

  // ── Risk level display ─────────────────────────────────────────────────
  function riskBadge(level) {
    const map = {
      critical: { cls: 'badge-danger',   label: '심각' },
      high:     { cls: 'badge-danger',   label: 'High' },
      medium:   { cls: 'badge-caution',  label: 'Medium' },
      low:      { cls: 'badge-normal',   label: 'Low' },
    };
    const r = map[level] || { cls: 'badge-neutral', label: level };
    return `<span class="badge ${r.cls}">${r.label}</span>`;
  }

  // ── Tab switcher ───────────────────────────────────────────────────────
  function initTabs(container) {
    const tabs = container.querySelectorAll('.tab-item');
    const panels = container.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.style.display = 'none');
        tab.classList.add('active');
        const target = container.querySelector(`#${tab.dataset.target}`);
        if (target) target.style.display = 'block';
      });
    });

    if (tabs.length > 0) tabs[0].click();
  }

  // ── Checklist toggle ───────────────────────────────────────────────────
  function initChecklists(container = document) {
    container.querySelectorAll('.checklist-checkbox').forEach(cb => {
      cb.addEventListener('click', () => {
        const checked = cb.classList.toggle('checked');
        cb.textContent = checked ? '✓' : '';
        const label = cb.closest('.checklist-item')?.querySelector('.checklist-label');
        if (label) label.classList.toggle('completed', checked);
        const item = cb.closest('.checklist-item');
        if (item) item.classList.toggle('completed', checked);
      });
    });
  }

  // ── Phase stepper render ───────────────────────────────────────────────
  function renderPhaseStepper(containerId, phases, currentPhaseId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = phases.map((phase, i) => {
      const done = phase.order < phases.find(p => p.phase_id === currentPhaseId)?.order;
      const current = phase.phase_id === currentPhaseId;
      const cls = done ? 'done' : current ? 'current' : 'pending';

      return `
        <div class="phase-step ${cls}" onclick="KTDeliveryWay.selectPhase('${phase.phase_id}')">
          <div class="phase-step-circle" style="${current ? `background:${getPhaseColor(phase.phase_id)}` : done ? 'background:var(--status-normal)' : ''}">
            ${done ? '✓' : phase.order}
          </div>
          <div class="phase-step-label">${phase.phase_short}</div>
        </div>`;
    }).join('');
  }

  // ── PRB status helper ──────────────────────────────────────────────────
  function prbStatusBadge(status) {
    const map = {
      confirmed:    { cls: 'badge-complete',         label: '처리완료' },
      processing:   { cls: 'badge-ext-processing',   label: '타시스템처리중' },
      pending:      { cls: 'badge-needcheck',         label: '확인필요' },
      not_required: { cls: 'badge-na',                label: '미대상' },
    };
    const s = map[status] || { cls: 'badge-neutral', label: status };
    return `<span class="badge ${s.cls}">${s.label}</span>`;
  }

  // ── Public API ─────────────────────────────────────────────────────────
  function selectPhase(phaseId) {
    state.currentPhase = phaseId;
    document.dispatchEvent(new CustomEvent('phaseChanged', { detail: { phaseId } }));
  }

  function init() {
    // Sidebar nav binding
    document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
      item.addEventListener('click', () => navigateTo(item.dataset.page));
    });

    // Init tabs and checklists on current page
    document.querySelectorAll('[data-tabs]').forEach(initTabs);
    initChecklists();

    // Hash-based routing
    const hash = window.location.hash.replace('#', '');
    if (hash) navigateTo(hash);

    console.log('[KT Delivery Way] Platform initialized');
  }

  return {
    state,
    navigateTo,
    getStatusBadge,
    getGateBadge,
    getTaskStatusBadge,
    getPhaseColor,
    riskBadge,
    prbStatusBadge,
    progressBar,
    initTabs,
    initChecklists,
    renderPhaseStepper,
    selectPhase,
    init,
  };
})();

document.addEventListener('DOMContentLoaded', KTDeliveryWay.init);
