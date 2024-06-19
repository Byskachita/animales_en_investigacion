import { Aguila, Serpiente, Oso, Lobo, Leon } from './modulos.js';

let animalesType = {};

(async () => {
  try {
    const responseObject = await fetch('./animales.json');
    const { animales } = await responseObject.json();

    animales.forEach((animal) => {
      animalesType[animal.nombre] = obtenerAnimal(animal);
    });
  } catch (error) {
    console.error('Error al cargar los datos de animales:', error);
  }
})();

const obtenerAnimal = (animal) => {
  const { nombre, imagen, sonido } = animal;
  switch (nombre) {
    case 'Leon':
      return new Leon(nombre, '', `./assets/imgs/${imagen}`, '', `./assets/sounds/${sonido}`);
    case 'Lobo':
      return new Lobo(nombre, '', `./assets/imgs/${imagen}`, '', `./assets/sounds/${sonido}`);
    case 'Oso':
      return new Oso(nombre, '', `./assets/imgs/${imagen}`, '', `./assets/sounds/${sonido}`);
    case 'Serpiente':
      return new Serpiente(nombre, '', `./assets/imgs/${imagen}`, '', `./assets/sounds/${sonido}`);
    case 'Aguila':
      return new Aguila(nombre, '', `./assets/imgs/${imagen}`, '', `./assets/sounds/${sonido}`);
    default:
      console.error('Seleccione un animal válido');
      return null;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const botonAgregar = document.getElementById('btnRegistrar');
  const contenedorAnimales = document.getElementById('Animales');

  botonAgregar.addEventListener('click', (e) => {
    e.preventDefault();
    const animalSelect = document.getElementById('animal').value;
    const edadSelect = document.getElementById('edad').value;
    const comentariosTextarea = document.getElementById('comentarios').value.trim();

    // Validar que se hayan ingresado todos los campos requeridos
    if (animalSelect === 'Seleccione un animal' || edadSelect === 'Seleccione un rango de años' || comentariosTextarea === '') {
      alert('Por favor completa todos los campos, incluyendo comentarios, rango de edad y tipo de animal.');
      return;
    }

    const objAnimal = animalesType[animalSelect];

    if (!objAnimal) {
      console.error('Animal no encontrado en el listado');
      return;
    }

    objAnimal.edad = edadSelect;
    objAnimal.comentarios = comentariosTextarea;

    // Crear nueva tarjeta para el animal
    const nuevaTarjeta = `
      <div class="card animal_new" style="width: 12rem;">
        <img src="${objAnimal.img}" class="card-img-top" style="max-height: 12rem;" alt="${objAnimal.nombre}">
        <div class="card-body">
          <h5 class="card-title">${objAnimal.nombre}</h5>
          <p class="card-text">Edad: ${objAnimal.edad}</p>
          <p class="card-text">Comentarios: ${objAnimal.comentarios}</p>
          <button class="btn btn-secondary" data-sound="${objAnimal.sonido}">
            <i class="fas fa-volume-up"></i>
          </button>
        </div>
      </div>
    `;

    contenedorAnimales.insertAdjacentHTML('beforeend', nuevaTarjeta);

    // Limpiar el formulario después de agregar la nueva tarjeta
    limpiarFormulario();

    // Obtener todos los botones de audio y agregar el evento de reproducción de sonido
    const audioButtons = document.querySelectorAll('.btn-secondary');
    audioButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const soundSrc = button.getAttribute('data-sound');
        const audio = new Audio(soundSrc);
        audio.play();
      });
    });
  });
});

// Función para limpiar el formulario de registro
function limpiarFormulario() {
  document.getElementById('animal').selectedIndex = 0;
  document.getElementById('edad').selectedIndex = 0;
  document.getElementById('comentarios').value = '';
  document.getElementById('preview').innerHTML = ''; // Limpia la previsualización
}

export function obtenerAnimalPorNombre(nombre) {
  const animalesData = [
    { nombre: 'Leon', img: 'assets/img/Leon.png', sonido: 'assets/sounds/Rugido.mp3' },
    { nombre: 'Lobo', img: 'assets/img/Lobo.jpg', sonido: 'assets/sounds/Aullido.mp3' },
    { nombre: 'Oso', img: 'assets/img/Oso.jpg', sonido: 'assets/sounds/Gruñido.mp3' },
    { nombre: 'Serpiente', img: 'assets/img/Serpiente.jpg', sonido: 'assets/sounds/Siseo.mp3' },
    { nombre: 'Aguila', img: 'assets/img/Aguila.png', sonido: 'assets/sounds/Chillido.mp3' },
  ];

  return animalesData.find(animal => animal.nombre === nombre);
}

export function agregarAnimal(animal) {
  const { nombre, edad, comentarios } = animal;
  const animalData = obtenerAnimalPorNombre(nombre);

  if (!animalData) {
    console.error(`No se encontró información para el animal: ${nombre}`);
    return;
  }

  const animalDiv = document.createElement('div');
  animalDiv.classList.add('card', 'm-2', 'bg-warning', 'text-dark');
  animalDiv.style.width = '18rem';

  animalDiv.innerHTML = `
    <img src="${animalData.img}" class="card-img-top" alt="${nombre}" data-nombre="${nombre}">
    <div class="card-body">
      <h5 class="card-title">${nombre}</h5>
      <p class="card-text"><strong>Edad:</strong> ${edad}</p>
      <p class="card-text"><strong>Comentarios:</strong> ${comentarios}</p>
    </div>
  `;

  document.getElementById('Animales').appendChild(animalDiv);
}

export function reproducirSonido(nombre) {
  const animalData = obtenerAnimalPorNombre(nombre);

  if (!animalData) {
    console.error(`No se encontró información para el animal: ${nombre}`);
    return;
  }

  const audioPlayer = document.getElementById('player');
  audioPlayer.src = animalData.sonido;
  audioPlayer.play();
}
