# Reglas para Codex

Este proyecto debe mantenerse como una web sencilla hecha por una persona con poca experiencia programando. La prioridad es que el codigo sea facil de leer, copiar y modificar.

## Estilo general

- Usar HTML y CSS normales.
- Evitar JavaScript si no es imprescindible.
- No usar frameworks, build tools, componentes complejos ni dependencias externas nuevas.
- No crear abstracciones avanzadas.
- No optimizar demasiado el codigo si eso lo vuelve mas dificil de entender.
- Preferir repetir un poco de HTML antes que crear una solucion complicada.

## HTML

- Mantener cada pagina como un archivo `.html` independiente.
- Usar nombres de clases descriptivos y simples.
- No generar contenido con JavaScript.
- Los enlaces entre paginas deben apuntar directamente a archivos como `index.html`, `tienda.html` o `servicios.html`.
- Si se anade una pagina nueva, copiar la estructura de una pagina existente y adaptarla.

## CSS

- Mantener los estilos principales en `styles.css`.
- Se permite CSS dentro de cada HTML si es algo especifico de esa pagina.
- Evitar selectores demasiado largos o dificiles de seguir.
- Evitar variables nuevas salvo que sean muy claras.
- No usar animaciones complejas.
- No usar layouts demasiado sofisticados si se puede resolver con `flex` o `grid` simple.

## Imagenes

- Las imagenes deben seguir siendo `div` placeholder mientras no haya imagenes reales.
- Usar clases como `img-ph` para mantener el aspecto actual.
- No anadir imagenes externas sin pedir permiso.

## Diseno

- El diseno debe parecerse al archivo de Figma de Tripiana Floristas.
- Se pueden aceptar pequenos detalles distintos, pero la estructura principal debe coincidir.
- Mantener los colores corporativos ya definidos.
- Mantener el header, hero, secciones y footer con el mismo estilo entre paginas.

## Que evitar

- No convertir la web en React, Vue, Next.js ni similar.
- No anadir TypeScript.
- No usar scripts para generar HTML.
- No meter logica complicada.
- No renombrar muchos archivos sin necesidad.
- No hacer refactors grandes solo para que el codigo sea "mas profesional".

## Forma de trabajar

- Hacer cambios pequenos y faciles de revisar.
- Comprobar que los enlaces locales siguen funcionando.
- Si se cambia una parte repetida como el header o footer, aplicar el mismo cambio en todas las paginas.
- Mantener el proyecto entendible para alguien que esta aprendiendo.
