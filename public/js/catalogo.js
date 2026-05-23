document.addEventListener('DOMContentLoaded', async () => {
  const catalogoCards = document.getElementById('catalogoCards');

  const createCard = (product) => {
    const card = document.createElement('div');
    card.className = 'card-producto';

    const nombre = product.name || 'Product';
    const descripcion = product.description || product.descripcion || product.descripcion_corta || 'Descripción no disponible';
    const precio = typeof product.price === 'number' ? product.price : parseFloat(product.price || 0);
    const precioFormateado = isNaN(precio) ? product.price || '0' : precio.toLocaleString('es-CO');
    const imagen = product.imagen || 'img/producto1.jpg';

    card.innerHTML = `
      <img src="${imagen}" alt="${nombre}">
      <h4>${nombre}</h4>
      <p class="descripcion-producto">${descripcion}</p>
      <p>$${precioFormateado}</p>
      <div class="rating">★★★★★</div>
      <button class="btn-comprar">Comprar</button>
    `;

    return card;
  };

  if (window.location.protocol === 'file:') {
    catalogoCards.innerHTML = '<div class="error">Abre esta página desde el servidor: http://localhost:5000/catalogo.html</div>';
    return;
  }

  try {
    const response = await fetch('/product');

    if (!response.ok) {
      throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
    }

    const productos = await response.json();

    catalogoCards.innerHTML = '';

    if (!Array.isArray(productos) || productos.length === 0) {
      catalogoCards.innerHTML = '<div class="empty">No hay productos disponibles.</div>';
      return;
    }

    productos.forEach((product) => {
      catalogoCards.appendChild(createCard(product));
    });
  } catch (error) {
    catalogoCards.innerHTML = `<div class="error">No se pudieron cargar los productos. ${error.message}</div>`;
    console.error('Error fetch /product:', error);
  }
});