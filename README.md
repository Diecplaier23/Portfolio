# Portfolio personal

Portfolio web estático, responsive y sin dependencias. La información personal y los proyectos se cargan desde `src/data/profile.json`.

## Ejecutar en local

Desde esta carpeta, inicia un servidor estático:

```powershell
py -m http.server 8000
```

Abre `http://localhost:8000/` en el navegador. También puedes usar la extensión Live Server de VS Code. No abras el HTML directamente con `file://`, porque el navegador puede bloquear la lectura del JSON.

## Personalizar

Edita `src/data/profile.json`; los datos están agrupados por categoría:

- `profile`: nombre, rol, descripción, estado laboral, correo y avatar.
- `copy`: textos personalizables de presentación, secciones, contacto, SEO y pie de página.
- `projects`: lista de proyectos, con descripción, tecnologías, enlaces, imagen y destacado.
- `socials`: enlaces de GitHub, LinkedIn, web personal e Instagram. Para Instagram, `instagram` contiene la URL pública del perfil y `instagramLabel` el texto visible (por ejemplo, `@tuusuario`). Se muestra con el mismo estilo que el correo y abre el perfil en una pestaña nueva. Si la URL está vacía, no aparece.

Los textos decorativos de la ilustración y el enlace para deslizar no son campos de configuración. Las tecnologías de la sección de habilidades se generan a partir de los proyectos, sin duplicar información. Hay un objeto de proyecto vacío listo para completar al final del array `projects`; no aparece en la web hasta que le pongas un `name`. Para añadir más, copia ese objeto. `image` acepta una ruta a una imagen o puede dejarse vacío. Los enlaces al sitio y al código aparecen dentro del menú de cada tarjeta. `featured: true` destaca un proyecto. Los botones y la navegación conservan sus etiquetas en el HTML.

La categoría `design` queda como una posible ampliación futura; todavía no hay opciones de diseño configurables.

El portfolio no muestra enlaces sin configurar y utiliza un marcador visual cuando falta la imagen. Las redes disponibles son `github`, `linkedin` y `website`.
