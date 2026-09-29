/* SaifKS Hero Gear v28: audited calculations, independent exclusive weapon and UI hardening. */
(() => {
  const BUILD = 'hero-gear-v28-audited-20260930';

  /* Correct the current red-gear XP table (levels 121-139 were each 50 XP high). */
  DB.enhancement_levels.forEach(row => {
    if (row.level >= 121 && row.level <= 139) row.xp_incremental -= 50;
  });
  let cumulativeXp = 0;
  DB.enhancement_levels.forEach(row => {
    cumulativeXp += row.xp_incremental;
    row.xp_cumulative = cumulativeXp;
  });
  DB.meta.schema_version = '1.1.0';
  DB.meta.generated_date = '2026-09-30';
  DB.meta.verification_status = 'audited against current reference tables';
  DB.meta.known_discrepancy = null;

  requiredMastery = level => {
    if (level >= 200) return 15;
    if (level >= 180) return 14;
    if (level >= 160) return 13;
    if (level >= 140) return 12;
    if (level >= 120) return 11;
    if (level >= 101) return 10;
    return 0;
  };

  /* Migrate the old per-piece weapon values to one independent weapon plan. */
  let migratedWidgetCurrent = Number(S.widgetC) || 0;
  let migratedWidgetTarget = Number(S.widgetT) || 0;
  GEAR_TROOPS.forEach(t => GEAR_PIECES.forEach(p => {
    const profile = gearProfiles[t][p];
    if (profile.levelT === 100 && profile.levelC <= 100 && profile.masteryC === 0 && profile.masteryT === 10) {
      profile.masteryT = 0;
    }
    migratedWidgetCurrent = Math.max(migratedWidgetCurrent, Number(profile.widgetC) || 0);
    migratedWidgetTarget = Math.max(migratedWidgetTarget, Number(profile.widgetT) || 0);
    delete profile.widgetC;
    delete profile.widgetT;
  }));
  const selectedProfile = gearProfiles[troop][piece];
  S.levelC = selectedProfile.levelC;
  S.levelT = selectedProfile.levelT;
  S.masteryC = selectedProfile.masteryC;
  S.masteryT = selectedProfile.masteryT;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved?.exclusiveWeapon) {
      migratedWidgetCurrent = Number(saved.exclusiveWeapon.current) || 0;
      migratedWidgetTarget = Number(saved.exclusiveWeapon.target) || 0;
    }
  } catch {}
  S.widgetC = migratedWidgetCurrent;
  S.widgetT = Math.max(migratedWidgetCurrent, migratedWidgetTarget);

  saveCurrentGearProfile = () => {
    const target = gearProfiles[troop][piece];
    target.levelC = S.levelC;
    target.levelT = S.levelT;
    target.masteryC = S.masteryC;
    target.masteryT = S.masteryT;
  };
  loadCurrentGearProfile = () => {
    const source = gearProfiles[troop][piece];
    S.levelC = source.levelC;
    S.levelT = source.levelT;
    S.masteryC = source.masteryC;
    S.masteryT = source.masteryT;
  };
  activePlans = () => {
    saveCurrentGearProfile();
    const plans = [];
    GEAR_TROOPS.forEach(t => GEAR_PIECES.forEach(p => {
      const profile = gearProfiles[t][p];
      const valid = profile.levelT > profile.levelC || profile.masteryT > profile.masteryC;
      if (profile.planned && valid) plans.push({ troop: t, piece: p, profile });
    }));
    return plans;
  };
  widgetCost = () => {
    let widgets = 0;
    for (let level = S.widgetC + 1; level <= S.widgetT; level += 1) widgets += level * 5;
    return widgets;
  };
  aggregateCosts = (plans = activePlans()) => {
    const totals = plans.reduce((sum, plan) => {
      const enhancement = enhancementCost(plan.profile);
      const forge = masteryCost(plan.profile);
      sum.xp += enhancement.xp;
      sum.mi += enhancement.mi;
      sum.my += enhancement.my + forge.my;
      sum.ha += forge.ha;
      return sum;
    }, { xp: 0, mi: 0, my: 0, ha: 0, w: 0 });
    totals.w = widgetCost();
    return totals;
  };
  saveState = () => {
    try {
      saveCurrentGearProfile();
      const inputs = {};
      INPUT_IDS.forEach(id => { inputs[id] = $('#' + id).value; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: BUILD,
        S: { levelC: S.levelC, levelT: S.levelT, masteryC: S.masteryC, masteryT: S.masteryT },
        exclusiveWeapon: { current: S.widgetC, target: S.widgetT },
        gearProfiles, troop, piece, resultFilter, inputs,
        optionalOpen: $('#optionalWrap').classList.contains('open'),
        advancedOpen: $('#advancedBlock').classList.contains('open')
      }));
    } catch (error) {
      console.warn('Could not save Hero Gear state', error);
    }
  };

  const exclusivePanel = $('#widgetC')?.closest('.upgrade');
  if (exclusivePanel) {
    exclusivePanel.id = 'exclusiveWeaponPanel';
    exclusivePanel.classList.remove('advanced-block');
    exclusivePanel.classList.add('exclusive-weapon-panel');
  }

  const legacyRender = render;
  render = () => {
    legacyRender();
    const plans = activePlans();
    const weaponActive = S.widgetT > S.widgetC;
    ['#widgetC', '#widgetT'].forEach(selector => { $(selector).disabled = false; });
    const validGear = S.levelT > S.levelC || S.masteryT > S.masteryC;
    $('#addPlan').disabled = !gearSelectionReady || !validGear;
    if (gearSelectionReady && !validGear) $('#planActionHint').textContent = ux('chooseHigher');
    $('#overviewPlans').textContent = plans.length + (weaponActive ? 1 : 0);
    if (weaponActive) {
      $('#savedPlans .saved-plan-empty')?.remove();
      const row = document.createElement('div');
      row.className = 'saved-plan exclusive-weapon-plan';
      row.innerHTML = `<div class="saved-plan-main"><b>⚙️ ${tr('exclusiveGear')}</b><span>Lv ${S.widgetC} → ${S.widgetT}</span></div>`;
      $('#savedPlans').appendChild(row);
    }
    if (!plans.length && weaponActive) {
      const state = $('#resultState');
      state.textContent = ux('upgradeCost');
      state.className = 'result-state';
    }
    saveState();
  };

  $('#addPlan').onclick = event => {
    event.preventDefault();
    event.stopPropagation();
    if (!gearSelectionReady) return false;
    S.levelC = +$('#levelC').value || 0;
    S.levelT = +$('#levelT').value || 0;
    S.masteryC = +$('#masteryC').value || 0;
    S.masteryT = +$('#masteryT').value || 0;
    normalize();
    saveCurrentGearProfile();
    const profile = gearProfiles[troop][piece];
    const valid = profile.levelT > profile.levelC || profile.masteryT > profile.masteryC;
    if (!valid) {
      $('#planActionHint').textContent = ux('chooseHigher');
      showToast(ux('chooseHigherShort'));
      return false;
    }
    const wasPlanned = Boolean(profile.planned);
    profile.planned = true;
    render();
    $('#planActionHint').textContent = (wasPlanned ? ux('planUpdated') : ux('gearAdded')) + ' ✓';
    showToast(wasPlanned ? ux('planUpdated') : ux('gearAdded'));
    return false;
  };

  const oldReset = $('#resetConfirmAction').onclick;
  $('#resetConfirmAction').onclick = event => {
    S.widgetC = 0;
    S.widgetT = 0;
    oldReset?.call($('#resetConfirmAction'), event);
  };

  $('#copy').onclick = async () => {
    const plans = activePlans();
    const totals = aggregateCosts(plans);
    const inventory = owned();
    const lines = [ux('reportTitle'), '━━━━━━━━━━━━━━━━━━', '', ux('savedPlans')];
    plans.forEach(plan => {
      const profile = plan.profile;
      const parts = [];
      if (profile.levelT > profile.levelC) parts.push(`${tr('gearUpgrade')}: ${profile.levelC} → ${profile.levelT}`);
      if (profile.masteryT > profile.masteryC) parts.push(`${tr('masteryForge')}: ${profile.masteryC} → ${profile.masteryT}`);
      lines.push(`• ${tr(plan.troop)} · ${tr(plan.piece)} — ${parts.join(' | ')}`);
    });
    if (S.widgetT > S.widgetC) lines.push(`• ${tr('exclusiveGear')} — ${S.widgetC} → ${S.widgetT}`);
    if (!plans.length && S.widgetT <= S.widgetC) lines.push('• ' + ux('noSavedPlans'));
    const resources = [
      [tr('xp'), totals.xp, inventory.xp],
      [tr('mithril'), totals.mi, inventory.mi],
      [tr('mythic'), totals.my, inventory.my],
      [tr('hammers'), totals.ha, inventory.ha],
      [tr('widgets'), totals.w, inventory.w]
    ].filter(([, needed]) => needed > 0);
    if (resources.length) {
      lines.push('', ux('remainingMaterials'));
      resources.forEach(([label, needed, available]) => {
        const remaining = Math.max(0, needed - available);
        lines.push(`• ${label} — ${ux('required')}: ${fmt(needed)} | ${ux('available')}: ${fmt(available)} | ${ux('remaining')}: ${fmt(remaining)}`);
      });
    }
    lines.push('', '━━━━━━━━━━━━━━━━━━', 'SaifKS.com | Built by Saif', '▶ YouTube');
    const report = lines.join('\n');
    try {
      await navigator.clipboard.writeText(report);
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = report;
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand('copy');
      fallback.remove();
    }
    $('#copy').textContent = tr('copied');
    showToast(ux('planCopied'));
    setTimeout(() => { $('#copy').textContent = tr('copyPlan'); }, 1300);
  };

  /* Accessible labels remain correct after every language change. */
  const syncAccessibility = () => {
    document.querySelectorAll('.field, .item').forEach(group => {
      const control = group.querySelector('input, select');
      const label = group.querySelector('label');
      if (!control || !label) return;
      label.htmlFor = control.id;
      control.setAttribute('aria-label', label.textContent.trim());
    });
    $('#advancedToggle')?.setAttribute('aria-expanded', String($('#advancedBlock')?.classList.contains('open')));
    $('#optionalToggle')?.setAttribute('aria-expanded', String($('#optionalWrap')?.classList.contains('open')));
  };
  $('#lang')?.addEventListener('change', () => setTimeout(syncAccessibility));
  $('#advancedToggle')?.addEventListener('click', () => setTimeout(syncAccessibility));
  $('#optionalToggle')?.addEventListener('click', () => setTimeout(syncAccessibility));

  const resetDialog = $('#resetConfirm');
  document.addEventListener('keydown', event => {
    if (!resetDialog?.classList.contains('open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      $('#resetCancel')?.click();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...resetDialog.querySelectorAll('button:not([disabled])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* Put inventory after the planner and collapse it initially on small screens. */
  const inventory = document.querySelector('.inventory-hub');
  const plannerCard = $('#levelC')?.closest('.card');
  if (inventory && plannerCard) {
    plannerCard.after(inventory);
    const head = inventory.querySelector('.inventory-hub-head');
    if (head) {
      head.setAttribute('role', 'button');
      head.setAttribute('tabindex', '0');
      head.setAttribute('aria-controls', 'inventoryHubBody');
      inventory.querySelector('.inventory-hub-body').id = 'inventoryHubBody';
      const setInventory = open => {
        inventory.classList.toggle('open', open);
        head.setAttribute('aria-expanded', String(open));
      };
      setInventory(!matchMedia('(max-width: 720px)').matches);
      const toggleInventory = () => setInventory(!inventory.classList.contains('open'));
      head.addEventListener('click', toggleInventory);
      head.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleInventory();
        }
      });
    }
  }

  addEventListener('storage', event => {
    if (event.key === 'saifRallyLang' && langs.includes(event.newValue) && event.newValue !== lang) {
      lang = event.newValue;
      applyLang();
    }
  });

  syncAccessibility();
  render();
})();
