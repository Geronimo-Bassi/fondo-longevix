# fondo-longevix

Fondo de Longevix para Claude Code Desktop, para el equipo de Longevix. Pone el logo de Longevix repetido en gris suave detrás de la conversación y cambia los colores de la app a un gris frío, en modo claro y oscuro. Es estático, así que no genera lag.

El logo se repite en tamaño chico para que se vea entero aunque la lista de sesiones, los paneles o el chat tapen partes de la ventana.

Repositorio privado: solo pueden instalarlo las personas con acceso en GitHub.

## Antes de instalar

1. Pedile a Geronimo que te invite al repositorio `Geronimo-Bassi/fondo-longevix` y aceptá la invitación que llega por mail o en GitHub.
2. Tené GitHub configurado en tu computadora, para que Claude Code pueda descargar un repositorio privado. Lo más simple es instalar GitHub CLI y correr:

   ```
   gh auth login
   ```

## Instalar

En una sesión de Claude Code:

```
/plugin install fondo-longevix --marketplace Geronimo-Bassi/fondo-longevix
```

Respondé `y` para agregar el marketplace y después elegí el alcance (Enter para el de usuario).

Desde una terminal:

```
claude plugin install fondo-longevix --marketplace Geronimo-Bassi/fondo-longevix
```

En la app de escritorio: hacé clic en **+** al lado de la caja del prompt, después en **Plugins**, **Add marketplace** con `Geronimo-Bassi/fondo-longevix` y por último **Add plugin**.

El fondo aparece en las sesiones nuevas. En una sesión abierta, corré `/reload-plugins`.

## Usar

```
/longevix   prende o apaga el fondo (recuerda lo que elegiste)
```

Si también tenés instalado el plugin `fondos`, apagalo con `/fondo apagado` para que no se pisen los dos fondos.

## Límites

- Se ve solo en la app de escritorio y en el celular. En la terminal y en VS Code no cambia nada.
- Los pedidos de permiso, las preguntas, los bloques de código y la caja del prompt mantienen el estilo normal de la app.

## Actualizar

```
claude plugin update fondo-longevix@fondo-longevix
```

Después, `/reload-plugins` en las sesiones abiertas.
