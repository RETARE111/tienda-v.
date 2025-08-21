document.addEventListener("DOMContentLoaded", () => {
  const listaCarrito = document.querySelector("#lista-carrito");
  const totalEl = document.querySelector("#total");
  const btnVaciar = document.querySelector("#vaciar-carrito");
  let total = 0;

  // Sumar todos los <li> del carrito usando su data-precio
  function actualizarTotal() {
    let suma = 0;
    listaCarrito.querySelectorAll("li[data-precio]").forEach(li => {
      suma += parseFloat(li.getAttribute("data-precio")) || 0;
    });
    total = suma;
    totalEl.textContent = `Total: S/. ${total.toFixed(2)}`;
  }

  // Extraer precio (acepta "S/. 149.90", "S/ 149,90", etc.)
  function obtenerPrecioDesde(card) {
    const el =
      card.querySelector(".precio-descuento strong") ||
      card.querySelector(".precio");
    if (!el) return 0;
    const txt = el.textContent;
    const match = txt.replace(/\s/g, "").match(/[\d.,]+/);
    if (!match) return 0;
    let num = match[0];
    // Normaliza: si hay coma, úsala como decimal
    if (num.includes(",") && !num.includes(".")) num = num.replace(",", ".");
    // Si trae separador de miles y decimal, deja solo el punto decimal final
    // (no lo necesitamos ahora, pero evita NaN en algunos formateos)
    return parseFloat(num.replace(/(?!^)[,.](?=\d{3}\b)/g, "").replace(",", "."));
  }

  // Agregar listeners a TODOS los botones "Añadir al carrito"
  document.querySelectorAll(".boton-carrito").forEach(boton => {
    boton.addEventListener("click", () => {
      const card = boton.closest(".producto, .info-producto");
      if (!card) return;

      const nombre = (card.querySelector("h3, h2")?.textContent || "Producto").trim();
      const precio = obtenerPrecioDesde(card);

      // Quita el mensaje "Tu carrito está vacío"
      if (listaCarrito.firstElementChild?.textContent.includes("vacío")) {
        listaCarrito.innerHTML = "";
      }

      // Crea el item
      const li = document.createElement("li");
      li.setAttribute("data-precio", precio.toString());
      li.innerHTML = `
        <span class="item-nombre">${nombre}</span>
        <span class="item-precio">S/. ${precio.toFixed(2)}</span>
        <button class="eliminar" aria-label="Eliminar">❌</button>
      `;
      listaCarrito.appendChild(li);

      actualizarTotal();
    });
  });

  // Delegación: eliminar productos con el botón ❌
  listaCarrito.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar")) {
      const li = e.target.closest("li");
      li?.remove();

      if (listaCarrito.children.length === 0) {
        listaCarrito.innerHTML = "<li>Tu carrito está vacío</li>";
      }
      actualizarTotal();
    }
  });

  // Vaciar carrito
  btnVaciar?.addEventListener("click", () => {
    listaCarrito.innerHTML = "<li>Tu carrito está vacío</li>";
    total = 0;
    totalEl.textContent = "Total: S/. 0.00";
  });
});
