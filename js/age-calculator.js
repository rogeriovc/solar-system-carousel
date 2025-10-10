// Períodos orbitais em dias terrestres
const orbitalPeriods = {
  mercury: { name: 'Mercúrio', days: 88, color: '#a8a29e' },
  venus:   { name: 'Vênus',   days: 225, color: '#fbbf24' },
  earth:   { name: 'Terra',   days: 365.25, color: '#3b82f6' },
  mars:    { name: 'Marte',   days: 687, color: '#ef4444' },
  jupiter: { name: 'Júpiter', days: 4333, color: '#f97316' },
  saturn:  { name: 'Saturno', days: 10759, color: '#eab308' },
  uranus:  { name: 'Urano',   days: 30687, color: '#06b6d4' },
  neptune: { name: 'Netuno',  days: 60190, color: '#6366f1' }
};

const form = document.getElementById('ageForm');
const resultsSection = document.getElementById('resultsSection');
const planetsGrid = document.getElementById('planetsGrid');
const displayName = document.getElementById('displayName');
const earthAge = document.getElementById('earthAge');
const birthDateInput = document.getElementById('birthDate');
const userNameInput = document.getElementById('userName');

// Define data máxima como hoje (already had, mantive)
birthDateInput.max = new Date().toISOString().split('T')[0];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  calculateAges();
});

function calculateAges() {
  const name = userNameInput.value.trim() || 'Usuário';
  const birthDateValue = birthDateInput.value;

  // Validações simples
  if (!birthDateValue) {
    alert('Escolhe uma data de nascimento válida ');
    birthDateInput.focus();
    return;
  }

  const birthDate = new Date(birthDateValue);
  const today = new Date();

  // Proteção contra datas futuras
  const todayYMD = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const birthYMD  = new Date(Date.UTC(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()));
  if (birthYMD > todayYMD) {
    alert('Data no futuro? Corrige isso aí ');
    birthDateInput.focus();
    return;
  }

  // Calcular idade em dias usando UTC pra evitar problemas de fuso/DST
  const msPerDay = 1000 * 60 * 60 * 24;
  const ageInDays = Math.floor((todayYMD - birthYMD) / msPerDay);

  // Idade em anos terrestres (valor numérico)
  const ageInYearsNum = ageInDays / 365.25;

  // Atualizar informações do usuário (formatadas)
  displayName.textContent = name;
  earthAge.textContent = ageInYearsNum.toFixed(2);

  // Limpar grid anterior
  planetsGrid.innerHTML = '';

  // Calcular e criar cards para cada planeta
  Object.entries(orbitalPeriods).forEach(([key, planet]) => {
    // idade do usuário no planeta (número)
    const planetAgeNum = ageInDays / planet.days;
    const card = createPlanetCard(planet, planetAgeNum, ageInDays);
    planetsGrid.appendChild(card);
  });

  // Mostrar resultados com animação suave
  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Animar cards
  setTimeout(() => {
    const cards = planetsGrid.querySelectorAll('.planet-age-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 80);
    });
  }, 100);
}
function createPlanetCard(planet, planetAgeNum, ageInDays) {
  // planetAgeNum: número de anos no planeta (ex: 27.38)
  // progress: quanto do ano atual do planeta já passou (0-100%)
  const progress = ((ageInDays % planet.days) / planet.days) * 100;

  const card = document.createElement('article');
  card.className = 'planet-age-card';
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'all 0.45s cubic-bezier(.2,.9,.2,1)';

  // formata valores de exibição
  const ageDisplay = Number(planetAgeNum).toFixed(2);
  const periodoDias = planet.days.toLocaleString('pt-BR');
  const periodoAnos = (planet.days / 365.25).toFixed(2);

  card.innerHTML = `
    <div class="planet-age-header">
      <div class="planet-icon" aria-hidden="true" style="color: ${planet.color}"></div>
      <h3 class="planet-age-name" style="color: ${planet.color}">${planet.name}</h3>
    </div>

    <div class="age-display">
      <div class="age-number">${ageDisplay}</div>
      <div class="age-label">idade em ${planet.name.toLowerCase()}</div>
    </div>

    <div class="planet-info">
      <div class="info-item">
        <span class="info-label">Período orbital:</span>
        <span class="info-value">${periodoDias} dias terrestres</span>
      </div>
      <div class="info-item">
        <span class="info-label">Período (anos terrestres):</span>
        <span class="info-value">${periodoAnos} anos terrestres</span>
      </div>
    </div>

    <div class="age-bar" aria-hidden="true">
      <div class="age-bar-fill" style="width: ${Math.round(progress)}%; background: ${planet.color}"></div>
    </div>

    <div class="age-bar-label">
      <small>Progresso do ano atual: ${Math.round(progress)}%</small>
    </div>
  `;

  return card;
}
