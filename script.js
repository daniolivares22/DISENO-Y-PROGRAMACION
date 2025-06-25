const posiciones = [
  { top: '8%', left: '25%' },
  { top: '8%', right: '25%' },
  { top: '25%', left: '8%' },
  { top: '25%', right: '8%' },
  { bottom: '25%', left: '8%' },
  { bottom: '25%', right: '8%' },
  { bottom: '8%', left: '25%' },
  { bottom: '8%', right: '25%' }
];

let sillas = [];
let sillasCarrusel = [];

const nombresCarrusel = [
  "Wassily Chair",
  "Eames Lounge Chair",
  "Tulip Chair",
  "LC2 Chair",
  "Panton Chair",
  "Barcelona Chair",
  "Red and Blue Chair",
  "Egg Chair"
];

function obtenerValoresUnicos(prop) {
  return [...new Set(sillas.map(silla => silla[prop]).filter(Boolean))].sort();
}

function llenarFiltros() {
  const filtroDisenador = document.getElementById('filtro-disenador');
  const filtroMaterial = document.getElementById('filtro-material');
  const filtroAno = document.getElementById('filtro-ano');

  filtroDisenador.innerHTML = '<option value="">Todos</option>';
  filtroMaterial.innerHTML = '<option value="">Todos</option>';
  filtroAno.innerHTML = '<option value="">Todos</option>';

  obtenerValoresUnicos('disenador').forEach(d => {
    const option = document.createElement('option');
    option.value = d;
    option.textContent = d;
    filtroDisenador.appendChild(option);
  });

  obtenerValoresUnicos('material').forEach(m => {
    const option = document.createElement('option');
    option.value = m;
    option.textContent = m;
    filtroMaterial.appendChild(option);
  });

  obtenerValoresUnicos('año').forEach(a => {
    const option = document.createElement('option');
    option.value = a;
    option.textContent = a;
    filtroAno.appendChild(option);
  });
}

function crearFicha(silla) {
  const ficha = document.createElement('div');
  ficha.className = 'ficha';
  ficha.innerHTML = `
    <img src="${silla.imagen}" alt="${silla.nombre}" />
    <h3>${silla.nombre}</h3>
    <p><strong>Diseñador:</strong> ${silla.disenador}</p>
  `;

  ficha.addEventListener('click', () => {
    mostrarDetalleSilla(silla);
  });

  return ficha;
}

function filtrarFichas() {
  const filtroDisenador = document.getElementById('filtro-disenador').value;
  const filtroMaterial = document.getElementById('filtro-material').value;
  const filtroAno = document.getElementById('filtro-ano').value;

  const contenedor = document.getElementById('ficha-container');
  contenedor.innerHTML = '';

  const filtradas = sillas.filter(silla => {
    return (
      (filtroDisenador === '' || silla.disenador === filtroDisenador) &&
      (filtroMaterial === '' || silla.material === filtroMaterial) &&
      (filtroAno === '' || silla.año.toString() === filtroAno)
    );
  });

  filtradas.forEach(silla => {
    contenedor.appendChild(crearFicha(silla));
  });
}

function resetFiltros() {
  document.getElementById('filtro-disenador').value = '';
  document.getElementById('filtro-material').value = '';
  document.getElementById('filtro-ano').value = '';
  renderFichas();
}

function renderFichas() {
  const contenedor = document.getElementById('ficha-container');
  contenedor.innerHTML = '';
  sillas.forEach(silla => {
    contenedor.appendChild(crearFicha(silla));
  });
}

function renderCarrusel() {
  const contenedor = document.getElementById('carousel');
  contenedor.innerHTML = '';

  sillasCarrusel.forEach((silla, i) => {
    const div = document.createElement('div');
    div.className = 'chair';
    Object.assign(div.style, posiciones[i]);

    div.innerHTML = `
      <div class="image-wrapper">
        <img src="${silla.imagen}" alt="${silla.nombre}" onerror="this.style.display='none'" />
      </div>
      <div class="chair-info">
        <h3>${silla.nombre}</h3>
        <p>${silla.disenador}</p>
        <p>${silla.año}</p>
      </div>
    `;
    contenedor.appendChild(div);
  });

  const titulo = document.createElement('div');
  titulo.className = 'center-title';
  titulo.innerHTML = `
    <h1>SILLAS ICÓNICAS</h1>
    <p>DISEÑO MODERNO DEL SIGLO XX</p>
  `;
  contenedor.appendChild(titulo);
}

function iniciarRotacion() {
  setInterval(() => {
    sillasCarrusel.push(sillasCarrusel.shift());
    renderCarrusel();
  }, 3000);
}

function cargarGraficoCombinado(preciosData, ventasData) {
  const datosCombinados = sillas.map(silla => {
    const precio = preciosData.find(p => p.silla === silla.nombre || p.silla === silla.nombre.trim());
    const venta = ventasData.find(v => v.silla === silla.nombre || v.silla === silla.nombre.trim());
    return {
      silla: silla.nombre,
      precio_venta_usd: precio ? precio.precio_venta_usd : 0,
      ventas: venta ? venta.ventas : 0
    };
  });

  const ctx = document.getElementById('mixedChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: datosCombinados.map(d => d.silla),
      datasets: [
        {
          label: 'Precio (USD)',
          data: datosCombinados.map(d => d.precio_venta_usd),
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Ventas (millones)',
          data: datosCombinados.map(d => (d.ventas / 1000000).toFixed(2)),
          borderColor: '#3b82f6',
          backgroundColor: 'transparent',
          tension: 0.4,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Precio (USD)'
          },
          ticks: {
            callback: value => `$${value}`
          }
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Ventas (millones)'
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: value => `${value}M`
          }
        }
      }
    }
  });
}

function mostrarDetalleSilla(silla) {
  const modal = document.getElementById('modal-detalle');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="cerrar-modal">&times;</span>
      <h2>${silla.nombre}</h2>
      <img src="${silla.imagen}" alt="${silla.nombre}" />
      <p><strong>Diseñador:</strong> ${silla.disenador}</p>
      <p><strong>Año:</strong> ${silla.año}</p>
      ${silla.pais ? `<p><strong>País:</strong> ${silla.pais}</p>` : ''}
      <p>${silla.descripcion || ''}</p>
    </div>
  `;
  modal.style.display = 'block';

  document.getElementById('cerrar-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

window.addEventListener('click', e => {
  const modal = document.getElementById('modal-detalle');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    fetch('sillas.json').then(res => res.json()),
    fetch('precios.json').then(res => res.json()),
    fetch('ventas.json').then(res => res.json())
  ]).then(([dataSillas, dataPrecios, dataVentas]) => {
    sillas = dataSillas;
    sillasCarrusel = sillas.filter(s => nombresCarrusel.includes(s.nombre));
    renderCarrusel();
    iniciarRotacion();
    renderFichas();
    llenarFiltros();
    cargarGraficoCombinado(dataPrecios, dataVentas);

    document.getElementById('btn-filtrar').addEventListener('click', filtrarFichas);
    document.getElementById('btn-reset').addEventListener('click', resetFiltros);
  });
});

