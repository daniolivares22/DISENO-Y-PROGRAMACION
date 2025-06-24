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
let indices = [0,1,2,3,4,5,6,7];

function renderCarrusel() {
  const contenedor = document.getElementById('carousel');
  contenedor.innerHTML = '';

  indices.forEach((index, i) => {
    const silla = sillas[index];
    const div = document.createElement('div');
    div.className = 'chair';
    Object.assign(div.style, posiciones[i]);

    div.innerHTML = `
      <div class="image-wrapper">
        <img src="${silla.imagen}" alt="${silla.nombre}" onerror="this.style.display='none'" />
      </div>
      <div class="chair-info">
        <h3>${silla.nombre}</h3>
        <p>${silla.diseñador}</p>
        <p>${silla.año}</p>
      </div>
    `;
    contenedor.appendChild(div);
  });

  const titulo = document.createElement('div');
  titulo.className = 'center-title';
  titulo.innerHTML = `
    <h1>SILLAS ICÓNICAS</h1>
    <p>Diseño Moderno del Siglo XX</p>
  `;
  contenedor.appendChild(titulo);
}

const customCursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
});

const interactiveElements = document.querySelectorAll('.interactive-image');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        customCursor.classList.add('hovering');
    });
    element.addEventListener('mouseleave', () => {
        customCursor.classList.remove('hovering');
    });
});

document.querySelectorAll('a, p, button').forEach(element => {
    element.addEventListener('mouseenter', () => {
        customCursor.classList.add('hovering');
    });
    element.addEventListener('mouseleave', () => {
        customCursor.classList.remove('hovering');
    });
});

document.addEventListener('mouseleave', () => {
    customCursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    customCursor.style.opacity = '1';
});

function iniciarRotacion() {
  setInterval(() => {
    indices = indices.map(i => (i + 1) % sillas.length);
    renderCarrusel();
  }, 3000);
}

function cargarGraficoPrecios(data) {
  new Chart(document.getElementById('priceChart'), {
    type: 'line',
    data: {
      labels: data.map(d => d.silla),
      datasets: [{
        label: 'Precio (USD)',
        data: data.map(d => d.precio_venta_usd),
        borderColor: '#10b981',
        tension: 0.4
      }]
    },
    options: {
      scales: {
        y: {
          ticks: {
            callback: value => `$${value}`
          }
        }
      }
    }
  });
}

function cargarGraficoVentas(data) {
  new Chart(document.getElementById('salesChart'), {
    type: 'line',
    data: {
      labels: data.map(d => d.silla),
      datasets: [{
        label: 'Ventas',
        data: data.map(d => d.ventas),
        borderColor: '#3b82f6',
        tension: 0.4
      }]
    },
    options: {
      scales: {
        y: {
          ticks: {
            callback: value => `${(value / 1000000).toFixed(1)}M`
          }
        }
      }
    }
  });
}

function renderFichas() {
  const contenedor = document.getElementById('ficha-container');
  sillas.forEach(silla => {
    const ficha = document.createElement('div');
    ficha.className = 'ficha';
    ficha.innerHTML = `
      <img src="${silla.imagen}" alt="${silla.nombre}" />
      <h3>${silla.nombre}</h3>
      <p><strong>Diseñador:</strong> ${silla.diseñador}</p>
      <p><strong>Año:</strong> ${silla.año}</p>
      ${silla.pais ? `<p><strong>País:</strong> ${silla.pais}</p>` : ''}
      <p class="descripcion">${silla.descripcion}</p>
    `;
    contenedor.appendChild(ficha);
  });
}

fetch('sillas.json').then(res => res.json()).then(data => {
  sillas = data;
  renderCarrusel();
  iniciarRotacion();
  renderFichas();
});

fetch('precios.json').then(res => res.json()).then(cargarGraficoPrecios);
fetch('ventas.json').then(res => res.json()).then(cargarGraficoVentas);
